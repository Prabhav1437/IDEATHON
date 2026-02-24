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
        getEmptyMember(), getEmptyMember()
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        if (members.length < 4) {
            setMembers([...members, getEmptyMember()]);
        }
    };

    const removeMember = (index) => {
        if (members.length > 2) {
            const newMembers = members.filter((_, i) => i !== index);
            setMembers(newMembers);
        }
    };

    const validateForm = () => {
        setError('');
        if (!teamName.trim()) return "Team name is required.";
        if (!leaderName.trim() || !leaderYear || !leaderBatch.trim() || !leaderUrn.trim()) return "All leader fields are required.";

        if (members.length < 2 || members.length > 4) {
            return "Total members (including leader) must be between 3 and 5.";
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
            // Reset form on success (optional, or just show success state)
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="card">
                <div className="header-logo">
                    <h1>Registration Complete</h1>
                    <p>You have successfully registered for IDEATHON 2026.</p>
                </div>
                <div className="alert alert-success">
                    {success}
                </div>
            </div>
        );
    }

    if (initialLoading) {
        return (
            <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <span className="spinner" style={{ borderTopColor: 'var(--primary-color)', borderWidth: '4px', width: '40px', height: '40px' }} />
            </div>
        );
    }

    if (alreadyRegistered) {
        return (
            <div className="card">
                <div className="header-logo">
                    <h1>Registration Status</h1>
                    <p>IDEATHON 2026</p>
                </div>
                <div className="alert alert-success">
                    You have already registered your team for IDEATHON 2026!
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="header-logo">
                <h1>IDEATHON 2026</h1>
                <p>Hackathon Team Registration</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "2rem" }}>
                    <h2>Team Details</h2>
                    <div className="form-group">
                        <label>Team Name <span style={{ color: "var(--error-color)" }}>*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. 404_Not_Found"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <h2>Leader Details</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name <span style={{ color: "var(--error-color)" }}>*</span></label>
                            <input
                                type="text"
                                value={leaderName}
                                onChange={(e) => setLeaderName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email ID</label>
                            <input
                                type="email"
                                value={leaderEmail}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Year <span style={{ color: "var(--error-color)" }}>*</span></label>
                            <select value={leaderYear} onChange={(e) => setLeaderYear(e.target.value)}>
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Batch <span style={{ color: "var(--error-color)" }}>*</span></label>
                            <select value={leaderBatch} onChange={(e) => setLeaderBatch(e.target.value)}>
                                <option value="">Select Batch</option>
                                <option value="Neumann">Neumann</option>
                                <option value="Hopper">Hopper</option>
                                <option value="Ramanujan">Ramanujan</option>
                                <option value="Turing">Turing</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>URN <span style={{ color: "var(--error-color)" }}>*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. E25b...."
                                value={leaderUrn}
                                onChange={(e) => setLeaderUrn(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <h2>Members List</h2>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Please add between 2 to 4 team members (excluding the leader, for a total of 3-5 members).
                    </p>

                    {members.map((member, index) => (
                        <div key={index} className="member-card">
                            <div className="member-header">
                                <h3>Member {index + 1}</h3>
                                {members.length > 2 && (
                                    <button type="button" className="remove-btn" onClick={() => removeMember(index)}>
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email ID</label>
                                    <input
                                        type="email"
                                        value={member.email}
                                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>URN</label>
                                    <input
                                        type="text"
                                        value={member.urn}
                                        onChange={(e) => handleMemberChange(index, 'urn', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Year</label>
                                    <select
                                        value={member.year}
                                        onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Batch</label>
                                    <select
                                        value={member.batch}
                                        onChange={(e) => handleMemberChange(index, 'batch', e.target.value)}
                                    >
                                        <option value="">Select Batch</option>
                                        <option value="Neumann">Neumann</option>
                                        <option value="Hopper">Hopper</option>
                                        <option value="Ramanujan">Ramanujan</option>
                                        <option value="Turing">Turing</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {members.length < 4 && (
                        <div className="add-btn-wrapper">
                            <button type="button" className="btn-secondary" onClick={addMember}>
                                + Add Member
                            </button>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? (
                        <><span className="spinner" style={{ marginRight: '8px', width: '18px', height: '18px' }} /> Submitting...</>
                    ) : (
                        'Complete Registration'
                    )}
                </button>
            </form>
        </div>
    );
}
