import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle,
    X,
    User,
    Mail,
    Hash,
    Phone,
    Github,
    Linkedin,
    ShieldCheck,
    Info,
    ChevronRight,
    Users,
    Clock,
    MapPin,
    Flag
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const MemberSection = ({ title, prefix, isLeader, formData, handleChange, batchOptions }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="saas-card p-8 bg-white space-y-8"
    >
        <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-black">{title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Full Name</label>
                <input
                    readOnly={isLeader}
                    required={!isLeader}
                    name={`${prefix}_name`}
                    value={formData[`${prefix}_name`] || ''}
                    onChange={handleChange}
                    className={`saas-input ${isLeader ? 'bg-brand-surface cursor-not-allowed' : ''}`}
                    placeholder="Enter your name"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Email Address</label>
                <input
                    readOnly={isLeader}
                    required={!isLeader}
                    type="email"
                    name={`${prefix}_email`}
                    value={formData[`${prefix}_email`] || ''}
                    onChange={handleChange}
                    className={`saas-input ${isLeader ? 'bg-brand-surface cursor-not-allowed' : ''}`}
                    placeholder="Enter your email address"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Unique Reg. No. (URN)</label>
                <input
                    required
                    name={`${prefix}_urn`}
                    value={formData[`${prefix}_urn`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="Enter your URN"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Phone Number</label>
                <input
                    required
                    type="tel"
                    inputMode="numeric"
                    name={`${prefix}_phone`}
                    value={formData[`${prefix}_phone`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="Enter your Phone Number"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Batch Period</label>
                <div className="relative">
                    <select
                        name={`${prefix}_batch`}
                        value={formData[`${prefix}_batch`] || '2025-2029'}
                        onChange={handleChange}
                        className="saas-input appearance-none cursor-pointer pr-10"
                    >
                        {batchOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-muted">
                        <ChevronRight className="rotate-90 w-4 h-4" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">GitHub Profile</label>
                <input
                    required
                    type="url"
                    name={`${prefix}_github`}
                    value={formData[`${prefix}_github`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="https://github.com/profile"
                />
            </div>

            <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">LinkedIn Profile (Optional)</label>
                <input
                    type="url"
                    name={`${prefix}_linkedin`}
                    value={formData[`${prefix}_linkedin`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="https://linkedin.com/in/profile"
                />
            </div>
        </div>
    </motion.div>
);

const ApplicationForm = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        team_name: '',
        leader_name: user?.user_metadata?.full_name || '',
        leader_email: user?.email || '',
        leader_urn: '',
        leader_github: '',
        leader_linkedin: '',
        leader_phone: '',
        leader_batch: '2025-2029',
        member1_name: '',
        member1_email: '',
        member1_urn: '',
        member1_github: '',
        member1_linkedin: '',
        member1_phone: '',
        member1_batch: '2025-2029',
        member2_name: '',
        member2_email: '',
        member2_urn: '',
        member2_github: '',
        member2_linkedin: '',
        member2_phone: '',
        member2_batch: '2025-2029',
        team_size: 3,
        college: 'NST-Pune',
        agreement: false
    });

    const [showRulesModal, setShowRulesModal] = useState(false);
    const [rulesAcknowledged, setRulesAcknowledged] = useState(false);
    const [rulesChecked, setRulesChecked] = useState({
        originality: false,
        teamSize: false,
        conduct: false,
        deadlines: false,
        dataPrivacy: false
    });

    const rules = [
        { id: 'originality', label: 'I confirm that our project will be an original work created during the hackathon.' },
        { id: 'teamSize', label: 'I confirm that our team consists of exactly 3 members as per the requirements.' },
        { id: 'conduct', label: 'I agree to maintain professional conduct and follow the code of conduct.' },
        { id: 'deadlines', label: 'I understand that all submissions must be made before the stipulated deadlines.' },
        { id: 'dataPrivacy', label: 'I agree to the collection and use of my team\'s data for event management purposes.' }
    ];

    const allRulesChecked = Object.values(rulesChecked).every(Boolean);

    const handleRuleToggle = (id) => {
        setRulesChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleConfirmRules = () => {
        if (allRulesChecked) {
            setRulesAcknowledged(true);
            setShowRulesModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.endsWith('_phone')) {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreement || !rulesAcknowledged) {
            setError('You must read and acknowledge all rules.');
            return;
        }

        if (formData.leader_batch !== formData.member1_batch || formData.leader_batch !== formData.member2_batch) {
            setError('Error: All team members must belong to the same batch.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Submission failed');

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-brand-surface font-inter">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="saas-card p-12 max-w-lg text-center space-y-8 shadow-lg"
                >
                    <div className="w-20 h-20 bg-green-50 text-green-600 flex items-center justify-center rounded-2xl mx-auto shadow-sm">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-brand-secondary">Registration Complete</h1>
                        <p className="text-brand-text-muted leading-relaxed">
                            Team <span className="text-brand-primary font-bold">{formData.team_name}</span> has been successfully registered for IDEATHON 26.
                        </p>
                    </div>
                    <Link to="/" className="saas-button-primary inline-flex items-center gap-2 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    const batchOptions = ["2024-2028", "2025-2029"];

    return (
        <div className="min-h-screen bg-brand-surface font-inter overflow-x-hidden">
            {/* Rules Modal */}
            <AnimatePresence>
                {showRulesModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-secondary/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white w-full max-w-xl saas-card p-0 overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-brand-secondary">Event Rules</h2>
                                    <button onClick={() => setShowRulesModal(false)} className="p-2 text-brand-text-muted hover:text-brand-secondary transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="bg-brand-surface p-4 rounded-lg flex gap-3 text-brand-text-muted">
                                    <Info size={18} className="shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium">Please review and acknowledge all requirements to proceed.</p>
                                </div>

                                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {rules.map((rule) => (
                                        <label key={rule.id} className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer ${rulesChecked[rule.id] ? 'bg-brand-primary/5 border-brand-primary' : 'bg-white border-brand-border hover:bg-brand-surface'}`}>
                                            <input
                                                type="checkbox"
                                                checked={rulesChecked[rule.id]}
                                                onChange={() => handleRuleToggle(rule.id)}
                                                className="w-5 h-5 mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 accent-brand-primary"
                                            />
                                            <span className="text-sm font-medium text-brand-secondary leading-relaxed">
                                                {rule.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={handleConfirmRules}
                                    disabled={!allRulesChecked}
                                    className={`w-full text-sm font-bold py-3.5 rounded-lg transition-all ${allRulesChecked ? 'saas-button-primary' : 'bg-brand-surface text-brand-text-muted cursor-not-allowed'}`}
                                >
                                    {allRulesChecked ? 'Acknowledge & Continue' : 'Please Check All Rules'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">
                {/* Left Column: Event Copy */}
                <aside className="lg:w-[40%] lg:sticky lg:top-0 h-fit lg:h-screen p-12 lg:p-16 flex flex-col justify-between">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-text-muted hover:text-brand-primary transition-colors mb-16">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>

                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                Feb 28-29, 2026
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-brand-secondary">
                                Register your <br />
                                <span className="text-brand-primary">Team</span>
                            </h1>
                            <p className="text-lg font-medium text-brand-text-muted leading-relaxed max-w-sm">
                                Ready to build the next major project at ADYPU? Register your team of 3 and start executing.
                            </p>

                            <div className="grid grid-cols-2 gap-8 pt-8">
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-brand-secondary">24 Hours</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Hackathon Duration</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-brand-secondary">300+</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Total Builders</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block pt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text-muted">
                        NST PUNE | NEWTON SCHOOL
                    </div>
                </aside>

                {/* Right Column: Form */}
                <main className="lg:w-[60%] p-8 lg:p-16 bg-white border-l border-brand-border">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-3 text-red-900"
                            >
                                <Info size={20} className="shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                            {/* Team Identity */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="saas-card p-8 bg-brand-surface"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-xl font-bold text-brand-secondary">Team Information</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted ml-1">Team Name *</label>
                                        <input
                                            required name="team_name" value={formData.team_name || ''} onChange={handleChange}
                                            className="saas-input text-lg font-bold"
                                            placeholder="Your Team Name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted ml-1">Required Size</label>
                                            <div className="saas-input bg-brand-border/20 text-brand-secondary font-bold flex items-center justify-center">
                                                3 Members
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted ml-1">Base Location</label>
                                            <div className="saas-input bg-brand-border/20 text-brand-secondary font-bold flex items-center justify-center">
                                                NST Pune
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Team Members */}
                            <MemberSection title="Team Leader" prefix="leader" isLeader={true} formData={formData} handleChange={handleChange} batchOptions={batchOptions} />
                            <MemberSection title="Team Member 2" prefix="member1" isLeader={false} formData={formData} handleChange={handleChange} batchOptions={batchOptions} />
                            <MemberSection title="Team Member 3" prefix="member2" isLeader={false} formData={formData} handleChange={handleChange} batchOptions={batchOptions} />

                            {/* Agreement & Submission */}
                            <div className="space-y-8 pt-12">
                                <div className={`saas-card p-6 transition-all ${rulesAcknowledged ? 'border-brand-primary bg-brand-primary/5' : 'opacity-50'}`}>
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange}
                                            className="w-6 h-6 mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 accent-brand-primary cursor-pointer disabled:cursor-not-allowed"
                                            disabled={!rulesAcknowledged}
                                        />
                                        <div className="space-y-3">
                                            <p className={`text-sm font-medium leading-relaxed ${rulesAcknowledged ? 'text-brand-secondary' : 'text-brand-text-muted'}`}>
                                                I confirm this is an original submission and agree to the
                                                <button type="button" onClick={() => setShowRulesModal(true)} className="text-brand-primary mx-1 font-bold hover:underline">event rules</button>
                                                which I have reviewed.
                                            </p>
                                            {!rulesAcknowledged && (
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                                                    <Info size={12} /> Please review rules first
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !formData.agreement || !rulesAcknowledged}
                                    className={`w-full text-lg font-bold py-5 rounded-brand transition-all flex items-center justify-center gap-3 ${(!formData.agreement || !rulesAcknowledged) ? 'bg-brand-surface text-brand-text-muted cursor-not-allowed border border-brand-border' : 'saas-button-primary'}`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                            processing...
                                        </>
                                    ) : (
                                        'Complete Registration'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ApplicationForm;
