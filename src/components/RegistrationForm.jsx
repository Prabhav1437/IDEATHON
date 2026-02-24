import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function RegistrationForm({ session }) {
    const [teamName, setTeamName] = useState('');

    const [leaderName, setLeaderName] = useState('');
    const [leaderYear, setLeaderYear] = useState('');
    const [leaderBatch, setLeaderBatch] = useState('');
    const [leaderUrn, setLeaderUrn] = useState('');
    const leaderEmail = session?.user?.email;

    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const checkRegistration = async () => {
            if (!leaderEmail) {
                setInitialLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('regestrations')
                    .select('id')
                    .eq('leader_email', leaderEmail)
                    .maybeSingle();

                if (error) throw error;
                if (data) {
                    setAlreadyRegistered(true);
                }
            } catch (err) {
                console.error('Error checking registration:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        checkRegistration();
    }, [leaderEmail]);

    const getEmptyMember = () => ({ name: '', email: '', year: '', batch: '', urn: '' });

    const [members, setMembers] = useState([
        getEmptyMember(), getEmptyMember() // Exact two members initialized
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const validateForm = () => {
        setError('');
        if (!teamName.trim()) return "Team name is required.";
        if (!leaderName.trim() || !leaderYear || !leaderBatch.trim() || !leaderUrn.trim()) return "All leader fields are required.";

        if (members.length !== 2) {
            return "Total members must be exactly 3 (including leader).";
        }

        // Validate each member
        for (let i = 0; i < members.length; i++) {
            const { name, email, year, batch, urn } = members[i];
            if (!name.trim() || !email.trim() || !year || !batch.trim() || !urn.trim()) {
                return `All fields are required for Member ${i + 1}.`;
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            // 1. Insert into regestrations table
            const { data: teamData, error: teamError } = await supabase
                .from('regestrations')
                .insert([
                    {
                        team_name: teamName,
                        leader_name: leaderName,
                        leader_email: leaderEmail,
                        leader_year: leaderYear,
                        leader_batch: leaderBatch,
                        leader_urn: leaderUrn
                    }
                ])
                .select()
                .single();

            if (teamError) {
                if (teamError.code === '23505') {
                    throw new Error('You or this team has already registered!');
                }
                throw teamError;
            }

            const teamId = teamData.id;

            // 2. Insert into team_members table
            const membersToInsert = members.map(m => ({
                team_id: teamId,
                name: m.name,
                email: m.email,
                year: m.year,
                batch: m.batch,
                urn: m.urn
            }));

            const { error: membersError } = await supabase
                .from('team_members')
                .insert(membersToInsert);

            if (membersError) throw membersError;

            setSuccess('Team registered successfully!');
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-brand-card rounded-2xl shadow-xl shadow-brand-text/5 p-6 sm:p-10 w-full animate-slide-up mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-brand-primary text-3xl font-bold tracking-tight mb-2">Registration Complete</h1>
                    <p className="text-lg text-brand-text-muted m-0">You have successfully registered for IDEATHON 2026.</p>
                </div>
                <div className="p-4 rounded-lg mb-6 text-sm font-medium text-center bg-brand-success-bg text-brand-success border border-[#a7f3d0]">
                    {success}
                </div>
            </div>
        );
    }

    if (initialLoading) {
        return (
            <div className="bg-brand-card rounded-2xl shadow-xl shadow-brand-text/5 p-12 w-full flex justify-center mx-auto">
                <span className="spinner !w-10 !h-10 !border-[4px] !border-t-brand-primary" />
            </div>
        );
    }

    if (alreadyRegistered) {
        return (
            <div className="bg-brand-card rounded-2xl shadow-xl shadow-brand-text/5 p-6 sm:p-10 w-full animate-slide-up mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-brand-primary text-3xl font-bold tracking-tight mb-2">Registration Status</h1>
                    <p className="text-lg text-brand-text-muted m-0">IDEATHON 2026</p>
                </div>
                <div className="p-4 rounded-lg mb-6 text-sm font-medium text-center bg-brand-success-bg text-brand-success border border-[#a7f3d0]">
                    You have already registered your team for IDEATHON 2026!
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.7)inset] border border-white/40 p-6 sm:p-14 lg:p-16 w-full animate-slide-up relative overflow-hidden ring-1 ring-slate-900/5 transition-all duration-300">
            {/* Enhanced visual abstract background blobs */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-40 left-0 -ml-32 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none mix-blend-multiply"></div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative gap-8 border-b border-brand-border/30 pb-10">
                <div className="text-center md:text-left flex-1">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-brand-primary text-xs font-bold tracking-widest uppercase mb-4 border border-blue-100 shadow-sm">Registration Open</span>
                    <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-3">IDEATHON <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">2026</span></h1>
                    <p className="text-xl text-slate-500 m-0 font-medium">Build the future with your team.</p>
                </div>
                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-brand-bg to-white rounded-3xl p-6 shadow-sm border border-brand-border/20 rotate-3 hover:rotate-6 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
            </div>

            {error && (
                <div className="p-5 rounded-2xl mb-10 text-sm font-semibold flex items-center gap-3 bg-red-50 text-red-600 border border-red-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full relative z-10">

                {/* Team Name Section */}
                <div className="mb-14 bg-brand-bg/40 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-sm transition-all hover:bg-brand-bg/60">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center font-bold">1</div>
                        <h2 className="text-2xl font-bold text-slate-800 m-0">Team Identity</h2>
                    </div>

                    <div className="mb-2">
                        <input
                            type="text"
                            className="w-full text-xl md:text-2xl px-6 py-5 border-none rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-brand-text transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-primary/20 placeholder:text-slate-300"
                            placeholder="Enter an awesome team name..."
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Leader Section */}
                <div className="mb-14 relative">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center font-bold">2</div>
                        <h2 className="text-2xl font-bold text-slate-800 m-0">Team Leader</h2>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 border-none rounded-xl bg-slate-50 shadow-inner text-lg font-medium text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    placeholder="John Doe"
                                    value={leaderName}
                                    onChange={(e) => setLeaderName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Registered Email</label>
                                <div className="w-full px-5 py-4 border-none rounded-xl bg-slate-100/70 text-lg font-medium text-slate-500 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    <span className="truncate">{leaderEmail}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">URN</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 border-none rounded-xl bg-slate-50 shadow-inner text-lg font-medium text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    placeholder="E25b...."
                                    value={leaderUrn}
                                    onChange={(e) => setLeaderUrn(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Year</label>
                                <div className="relative">
                                    <select className="appearance-none w-full px-5 py-4 border-none rounded-xl bg-slate-50 shadow-inner text-lg font-medium text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer" value={leaderYear} onChange={(e) => setLeaderYear(e.target.value)}>
                                        <option value="" disabled>Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Batch</label>
                                <div className="relative">
                                    <select className="appearance-none w-full px-5 py-4 border-none rounded-xl bg-slate-50 shadow-inner text-lg font-medium text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer" value={leaderBatch} onChange={(e) => setLeaderBatch(e.target.value)}>
                                        <option value="" disabled>Select Batch</option>
                                        <option value="Neumann">Neumann</option>
                                        <option value="Hopper">Hopper</option>
                                        <option value="Ramanujan">Ramanujan</option>
                                        <option value="Turing">Turing</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center font-bold">3</div>
                        <h2 className="text-2xl font-bold text-slate-800 m-0">Team Members</h2>
                    </div>
                    <p className="text-base text-slate-500 mb-8 ml-11 max-w-2xl font-medium">
                        Exactly 3 members are strictly required per team (Leader + 2 Members). Enter their details accurately below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {members.map((member, index) => (
                            <div key={index} className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.06)] transition-all duration-300 relative group">
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-900 rounded-2xl text-white flex items-center justify-center font-bold text-xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                    #{index + 2}
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Member Details</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border-none rounded-xl bg-slate-50 shadow-inner text-base font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email ID</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border-none rounded-xl bg-slate-50 shadow-inner text-base font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">URN</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border-none rounded-xl bg-slate-50 shadow-inner text-base font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                            value={member.urn}
                                            onChange={(e) => handleMemberChange(index, 'urn', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Year</label>
                                            <div className="relative">
                                                <select
                                                    className="appearance-none w-full px-4 py-3 border-none rounded-xl bg-slate-50 shadow-inner text-base font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
                                                    value={member.year}
                                                    onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                                                >
                                                    <option value="" disabled>Select</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Batch</label>
                                            <div className="relative">
                                                <select
                                                    className="appearance-none w-full px-4 py-3 border-none rounded-xl bg-slate-50 shadow-inner text-base font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
                                                    value={member.batch}
                                                    onChange={(e) => handleMemberChange(index, 'batch', e.target.value)}
                                                >
                                                    <option value="" disabled>Select</option>
                                                    <option value="Neumann">Neumann</option>
                                                    <option value="Hopper">Hopper</option>
                                                    <option value="Ramanujan">Ramanujan</option>
                                                    <option value="Turing">Turing</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-10 mt-10 border-t border-slate-200/50 flex flex-col items-center">
                    <button type="submit" className="w-full md:w-auto md:min-w-[400px] border-none rounded-[2rem] bg-slate-900 text-white font-bold text-xl py-6 px-10 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-brand-primary hover:shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner !w-6 !h-6 !border-[3px] !border-t-white" />
                                Processing Details...
                            </>
                        ) : (
                            <>
                                <span>Lock In Registration</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </>
                        )}
                    </button>
                    <p className="text-sm text-slate-400 font-medium mt-6 text-center">
                        Ensure all details are correct. By locking in, you confirm your 3-member squad.
                    </p>
                </div>
            </form>
        </div>
    );
}
