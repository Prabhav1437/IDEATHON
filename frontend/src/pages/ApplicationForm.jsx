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
    Flag,
    Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const MemberSection = ({ title, prefix, formData, handleChange, batchOptions }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="saas-card p-8 bg-white space-y-8"
    >
        <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-black">{title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Full Name *</label>
                <input
                    required
                    name={`${prefix}_name`}
                    value={formData[`${prefix}_name`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="Enter full name"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Email Address *</label>
                <input
                    required
                    type="email"
                    name={`${prefix}_email`}
                    value={formData[`${prefix}_email`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="Enter email address"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Unique Reg. No. (URN) *</label>
                <input
                    required
                    name={`${prefix}_urn`}
                    value={formData[`${prefix}_urn`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="Enter URN"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">Phone Number *</label>
                <input
                    required
                    type="tel"
                    inputMode="numeric"
                    name={`${prefix}_phone`}
                    value={formData[`${prefix}_phone`] || ''}
                    onChange={handleChange}
                    className="saas-input"
                    placeholder="Enter phone number"
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
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">GitHub Profile *</label>
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
        teamSize: false,
        namesCorrect: false,
        emailsCorrect: false,
        phonesCorrect: false,
        duration: false
    });

    const rules = [
        { id: 'teamSize', label: 'I confirm that there are exactly 3 members in our team.' },
        { id: 'namesCorrect', label: 'I confirm that all team member names provided are correct.' },
        { id: 'emailsCorrect', label: 'I confirm that all provided email addresses are correct.' },
        { id: 'phonesCorrect', label: 'I confirm that all phone numbers are correct.' },
        { id: 'duration', label: 'I understand that this is a 24-hour engineering hackathon.' }
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
            setError('Please acknowledge all rules and agree to the terms.');
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
            console.error('Submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-brand-surface font-inter overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-primary/10 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.05, 0.1, 0.05],
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-primary/5 rounded-full blur-[100px]"
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="saas-card p-12 max-w-lg w-full text-center space-y-10 shadow-2xl bg-white relative z-10"
                >
                    <div className="relative mx-auto w-24 h-24">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 bg-green-500 text-white flex items-center justify-center rounded-3xl shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        >
                            <CheckCircle className="w-12 h-12" strokeWidth={3} />
                        </motion.div>

                        {/* Particle burst animation */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, scale: 0 }}
                                animate={{
                                    x: Math.cos(i * 45 * Math.PI / 180) * 80,
                                    y: Math.sin(i * 45 * Math.PI / 180) * 80,
                                    scale: [0, 1, 0]
                                }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-green-500"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-extrabold text-brand-secondary tracking-tight"
                        >
                            Registration <br />Complete
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-brand-text-muted text-lg leading-relaxed"
                        >
                            Team <span className="text-brand-primary font-bold px-1.5 py-0.5 bg-brand-primary/10 rounded">{formData.team_name}</span> has been confirmed for <span className="text-brand-secondary font-bold">OverClock 2026</span>.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-4"
                    >
                        <Link
                            to="/"
                            className="saas-button-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20 group translate-y-0 active:translate-y-1 transition-all"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Homepage
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text-muted pt-4"
                    >
                        Check your email for next steps
                    </motion.p>
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

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-screen overflow-hidden">
                {/* Left Column: Event Copy */}
                <aside className="lg:w-[40%] lg:sticky lg:top-0 h-fit lg:h-screen p-12 lg:p-16 flex flex-col justify-between">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-text-muted hover:text-brand-primary transition-colors mb-16">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>

                        <div className="space-y-8">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                <Clock size={12} /> Feb 28 - Mar 1, 2026
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-brand-secondary">
                                Register your <br />
                                <span className="text-brand-primary">Team</span>
                            </h1>
                            <p className="text-lg font-medium text-brand-text-muted leading-relaxed max-w-sm">
                                Join 300+ builders at NST Pune for a 24-hour engineering challenge. Register your team of 3 by Feb 27.
                            </p>

                            <div className="grid grid-cols-2 gap-8 pt-8">
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-brand-secondary">24 Hours</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Persistence required</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-brand-secondary">300+</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Builders joining</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                        NST PUNE | ADYPU CAMPUS
                    </div>
                </aside>

                {/* Right Column: Form */}
                <main className="lg:w-[60%] h-full overflow-y-auto p-8 lg:p-16 bg-white border-l border-brand-border custom-scrollbar">
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
                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted ml-1">Location</label>
                                            <div className="saas-input bg-brand-border/20 text-brand-secondary font-bold flex items-center justify-center">
                                                ADYPU Campus
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Team Members */}
                            <MemberSection title="Team Leader" prefix="leader" formData={formData} handleChange={handleChange} batchOptions={batchOptions} />
                            <MemberSection title="Team Member 2" prefix="member1" formData={formData} handleChange={handleChange} batchOptions={batchOptions} />
                            <MemberSection title="Team Member 3" prefix="member2" formData={formData} handleChange={handleChange} batchOptions={batchOptions} />

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
                                            confining registration...
                                        </>
                                    ) : (
                                        <>
                                            Complete Registration
                                            <Sparkles size={20} />
                                        </>
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
