import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Zap,
    Target,
    Users,
    Calendar,
    Award,
    MessageSquare,
    LogIn,
    LogOut,
    ArrowRight,
    Star,
    Code,
    CheckCircle,
    Cpu,
    Clock,
    ShieldCheck,
    Activity,
    Terminal,
    Layers,
    MapPin,
    Flag,
    Plus,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const NavLink = ({ children, href }) => (
    <a href={href} className="text-sm font-black uppercase tracking-widest text-brand-text hover:bg-brand-accent transition-all py-2 px-4 border-b-2 border-transparent hover:border-black active:translate-y-1">
        {children}
    </a>
);

const LandingPage = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) console.error('Error logging in:', error.message);
        setLoading(false);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error.message);
    };

    const handleSwitchAccount = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                queryParams: { prompt: 'select_account' }
            }
        });
        if (error) console.error('Error switching account:', error.message);
        setLoading(false);
    };

    const isADYPU = user?.email?.endsWith('@adypu.edu.in');

    const bounceReveal = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-brand-text font-inter overflow-x-hidden">
            {/* Subtle Gradient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Navigation */}
            <nav className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-[100] transition-all duration-300 border rounded-2xl ${scrolled ? 'bg-white/40 backdrop-blur-md border-white/20 py-3 shadow-lg' : 'bg-white/20 backdrop-blur-sm border-white/10 py-5 shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <span className="text-xl font-bold tracking-tight text-brand-secondary font-space">
                            OverClock
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {!user ? (
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="saas-button-primary text-sm"
                            >
                                {loading ? 'Loading...' : 'Sign In'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 pl-3 py-1 pr-1 bg-brand-surface border border-brand-border rounded-full">
                                    <span className="text-xs font-medium text-brand-text-muted hidden sm:inline">{user.user_metadata.full_name}</span>
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-7 h-7 rounded-full border border-white" />
                                </div>
                                <button onClick={handleLogout} className="p-2 text-brand-text-muted hover:text-brand-primary transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-60 pb-32 px-6 overflow-hidden">
                <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                        <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        Newton School Presents
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-brand-secondary leading-[1.05]">
                            Build and test <br />
                            <span className="text-brand-primary">Prototypes</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-brand-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
                            OverClock is a 24-hour technical hackathon for 300+ builders at NST Pune.
                            Starting at 12:00 PM, industry challenges meet rapid engineering.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
                    >
                        {user ? (
                            isADYPU ? (
                                <Link
                                    to="/apply"
                                    className="saas-button-primary text-lg px-8 py-3.5 flex items-center gap-2 group"
                                >
                                    Proceed to Application
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <div className="saas-card p-6 bg-red-50 border-red-100 max-w-md text-left flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm shrink-0">
                                        <Flag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-red-900 mb-1">ADYPU Access Only</h3>
                                        <p className="text-sm text-red-700 mb-4 font-medium">This hackathon is reserved for ADYPU students. Switch accounts to join!</p>
                                        <button
                                            onClick={handleSwitchAccount}
                                            className="text-sm font-bold text-red-900 hover:underline flex items-center gap-1"
                                        >
                                            Switch account <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="saas-button-primary text-lg px-10 py-4"
                            >
                                Register for Ideathon
                            </button>
                        )}
                        {!user && (
                            <p className="text-sm font-semibold text-brand-text-muted">
                                Reserved for <span className="text-brand-secondary font-bold">ADYPU Pune</span> legends
                            </p>
                        )}
                    </motion.div>
                </div>
            </header>

            {/* Core Focus Section */}
            <section id="experience" className="py-32 px-6 bg-brand-surface border-y border-brand-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">The Core</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-secondary">Focused Engineering</h2>
                        <p className="text-brand-text-muted text-lg max-w-2xl mx-auto">
                            We provide the environment and technical resources to move from concept to testable prototype in 24 hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Layers, title: "Hardware Access", desc: "Utilize on-campus labs and labs resources to move from concept to testable prototype faster.", color: "bg-indigo-50 text-indigo-600" },
                            { icon: Clock, title: "Pure Build Time", desc: "24 hours of uninterrupted engineering. We handle the logistics; you focus on your technical stack.", color: "bg-blue-50 text-blue-600" },
                            { icon: ShieldCheck, title: "Vetted Peers", desc: "Work alongside a verified group of 300+ builders and technical peers", color: "bg-slate-50 text-slate-600" },
                            { icon: Activity, title: "Direct Feedback", desc: "Test your prototype with experienced engineers who value functional logic over presentation.", color: "bg-amber-50 text-amber-600" },
                            { icon: Terminal, title: "Concrete Tasks", desc: "Solve specific technical bottlenecks provided by our industry partners. Build what works.", color: "bg-brand-secondary/5 text-brand-secondary" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="saas-card p-8 group hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-brand-secondary">{item.title}</h3>
                                <p className="text-brand-text-muted text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roadmap section */}
            <section id="roadmap" className="py-32 bg-white px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-20 space-y-4">
                        <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Timeline</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-secondary">Hackday Roadmap</h2>
                        <p className="text-brand-text-muted text-lg max-w-2xl">
                            Key milestones for OverClock. Bookmark these dates.
                        </p>
                    </div>

                    <div className="relative space-y-8">
                        {/* Center Line */}
                        <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-brand-border md:-translate-x-1/2" />

                        {[
                            { step: "01", date: "FEB 27 - 8:00 PM", label: "Registration Deadline", status: "Active" },
                            { step: "02", date: "FEB 28 - 12:00 PM", label: "OverClock Starts", status: "Upcoming" },
                            { step: "03", date: "MAR 01 - EVENING", label: "Winners Announcement", status: "Finale" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row items-center gap-8 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Dot */}
                                <div className="absolute left-[16px] md:left-1/2 w-4 h-4 rounded-full bg-brand-primary border-4 border-white shadow-sm z-10 md:-translate-x-1/2" />

                                <div className="flex-1 w-full md:w-[45%]">
                                    <div className="saas-card p-6 hover:border-brand-primary transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">{item.status}</span>
                                            <span className="text-xs font-semibold text-brand-text-muted">{item.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-secondary">{item.label}</h3>
                                    </div>
                                </div>
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Venue: The Base Section */}
            <section id="base" className="py-32 bg-brand-surface px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Location</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-secondary">NST Pune Campus</h2>
                            <p className="text-brand-text-muted text-lg leading-relaxed">
                                Located in the heart of Knowledge City, our campus provides the ideal environment for high-intensity engineering and collaboration.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="saas-card p-6 bg-white">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                    <MapPin size={20} />
                                </div>
                                <h4 className="text-base font-bold text-brand-secondary mb-1">Address</h4>
                                <p className="text-sm text-brand-text-muted">ADYPU Campus, Lohegaon, Pune, Maharashtra</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="saas-card aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden group"
                        >
                            {/* Map Surface Grid Accent */}
                            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

                            <div className="relative z-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-brand-border flex items-center justify-center mx-auto text-brand-primary group-hover:scale-110 transition-transform">
                                    <MapPin size={32} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-secondary">4th & 5th floor (SOE) - ADYPU Campus </h3>
                                    <p className="text-sm font-medium text-brand-text-muted">Explore the battleground</p>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 saas-card px-3 py-1.5 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                                NST
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 bg-white border-t border-brand-border px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold tracking-tight text-brand-secondary font-space">OverClock</span>
                            </div>
                            <p className="text-brand-text-muted text-sm leading-relaxed max-w-xs">
                                Newton School of Technology Presents the premier engineering hackathon at NST Pune.
                                Build the future, one prototype at a time.
                            </p>
                        </div>

                        {[
                            { title: "Event", links: ["Schedule", "Tracks", "Mentors", "Prizes"] },
                            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Code of Conduct"] },
                            { title: "Social", links: ["Twitter", "LinkedIn", "Instagram"] }
                        ].map((group, i) => (
                            <div key={i} className="space-y-6">
                                <h4 className="text-brand-secondary font-bold text-xs uppercase tracking-widest">{group.title}</h4>
                                <ul className="space-y-3">
                                    {group.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-brand-text-muted text-sm hover:text-brand-primary transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-brand-text-muted text-[10px] font-bold uppercase tracking-widest">
                            © 2026 Newton School of Technology | NST-Pune
                        </p>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">
                                Status: Operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
