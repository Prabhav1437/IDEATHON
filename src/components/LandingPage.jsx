import React from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ error }) {
    const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error('Error logging in:', err.message);
        }
    };

    return (
        <div className="w-full min-h-screen bg-brand-bg flex flex-col font-inter">

            {/* Navbar (Glassmorphism Theme) */}
            <div className="w-full flex justify-center sticky top-6 z-50 px-4">
                <nav className="w-full max-w-5xl py-3 px-6 md:px-8 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full flex justify-between items-center transition-all duration-300">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="bg-gradient-to-br from-brand-primary to-cyan-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            I
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">IDEATHON <span className="text-brand-primary">26</span></span>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
                            <a href="#about" className="hover:text-brand-primary transition-colors cursor-pointer">About</a>
                            <a href="#timeline" className="hover:text-brand-primary transition-colors cursor-pointer">Timeline</a>
                            <a href="#prizes" className="hover:text-brand-primary transition-colors cursor-pointer">Prizes</a>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="bg-white/80 hover:bg-white backdrop-blur-md text-brand-primary border border-white/50 text-sm font-bold py-2.5 px-6 rounded-full shadow-[0_4px_15px_0_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_0_rgba(37,99,235,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            <span>Register / Login</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Global Error Banner */}
            {error && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg p-4 rounded-xl text-sm font-semibold flex items-center gap-3 bg-red-50 text-red-600 border border-red-100 shadow-xl shadow-red-500/10 animate-slide-up">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            {/* Hero Section */}
            <section className="pt-40 pb-20 md:pt-56 md:pb-36 px-6 sm:px-12 flex flex-col items-center text-center relative max-w-[1400px] mx-auto w-full min-h-[90vh] justify-center">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
                <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-[120px] -z-10 mix-blend-multiply"></div>

                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-50 text-brand-primary text-sm font-bold tracking-widest uppercase mb-10 border border-blue-100 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
                    Registration is Live
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black text-slate-900 tracking-tight leading-[1] mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    Build the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-brand-primary to-cyan-500">Unimaginable.</span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-slate-500 max-w-3xl leading-relaxed mb-12 font-medium animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    ADYPU's premier hackathon event of 2026. Join elite builders, solve massive problems, and create the future over 24 hours of intense coding.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={handleLogin}
                        className="bg-brand-primary hover:bg-blue-700 text-white text-lg sm:text-xl font-bold py-5 px-12 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                        Apply with ADYPU Email
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                    <a href="#about" className="bg-white hover:bg-slate-50 text-slate-700 text-lg sm:text-xl font-bold py-5 px-12 rounded-full shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center w-full sm:w-auto">
                        Learn More
                    </a>
                </div>
            </section>

            {/* About Details Section */}
            <section id="about" className="py-32 px-6 sm:px-12 bg-white border-y border-slate-100 relative">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">What to Expect</h2>
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto">A high-stakes environment where innovation meets execution.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Feature 1 */}
                        <div className="bg-brand-bg/50 rounded-[2.5rem] p-10 lg:p-12 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-100 text-brand-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">24 hours of Coding</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">Push your limits in an uninterrupted weekend of rapid prototyping and development alongside the best talent.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-brand-bg/50 rounded-[2.5rem] p-10 lg:p-12 border border-slate-100 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 group">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Expert Mentorship</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">Get guidance from industry veterans and renowned professors to pivot and scale your product architecture correctly.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-brand-bg/50 rounded-[2.5rem] p-10 lg:p-12 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 group">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" /><polyline points="15,9 18,9 18,11" /><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" /><line x1="6" y1="10" x2="6" y2="10" /></svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Massive Prize Pool</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">Win cash prizes, tech gear, and potential seed-funding opportunities for the most innovative solutions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section id="timeline" className="py-32 sm:px-12 relative overflow-hidden bg-slate-900 text-white w-full min-h-[80vh] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 -z-10"></div>

                <div className="max-w-[1200px] mx-auto w-full">
                    <div className="text-center md:text-left mb-20 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-4">Event Timeline</h2>
                            <p className="text-xl text-slate-400">Mark your calendars. Here is the path to greatness.</p>
                        </div>
                        <div className="hidden md:block">
                            <span className="inline-flex py-2 px-6 rounded-full bg-white/10 text-white text-lg font-bold tracking-widest uppercase backdrop-blur-md border border-white/20">
                                ADYPU Campus
                            </span>
                        </div>
                    </div>

                    <div className="relative border-l-2 border-slate-700/50 pl-10 ml-5 md:pl-20 md:ml-10 space-y-16 lg:space-y-24">

                        {/* Timeline Item 1 */}
                        <div className="relative group">
                            <div className="absolute -left-[51px] md:-left-[91px] top-1.5 w-6 h-6 rounded-full bg-brand-primary ring-8 ring-slate-900 group-hover:scale-125 transition-transform duration-300"></div>
                            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-[2rem] p-8 md:p-12 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20">
                                <span className="text-brand-primary font-bold tracking-widest text-sm md:text-base uppercase mb-3 block opacity-80">Phase 1</span>
                                <h3 className="text-3xl md:text-4xl font-black mb-4">Registration Opens</h3>
                                <p className="text-lg md:text-xl text-slate-300 font-medium mb-8 leading-relaxed max-w-3xl">Form your 3-member squads and lock in your details. Registrations are capped at limited teams and require university credentials.</p>
                                <div className="inline-flex items-center gap-3 text-base font-semibold text-white bg-white/10 py-3 px-6 rounded-xl border border-white/5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    Feb 25, 2026
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="relative group">
                            <div className="absolute -left-[51px] md:-left-[91px] top-1.5 w-6 h-6 rounded-full bg-slate-600 ring-8 ring-slate-900 group-hover:bg-cyan-400 transition-colors duration-300"></div>
                            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-[2rem] p-8 md:p-12 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-900/10">
                                <span className="text-slate-400 group-hover:text-cyan-400 transition-colors font-bold tracking-widest text-sm md:text-base uppercase mb-3 block opacity-80">Phase 2</span>
                                <h3 className="text-3xl md:text-4xl font-black mb-4">Hackathon Kickoff</h3>
                                <p className="text-lg md:text-xl text-slate-300 font-medium mb-8 leading-relaxed max-w-3xl">Opening ceremony, problem statement reveal, and the immediate start of the intense 24-hour development sprint in the main arena.</p>
                                <div className="inline-flex items-center gap-3 text-base font-semibold text-white bg-white/10 py-3 px-6 rounded-xl border border-white/5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 group-hover:text-cyan-300"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    Feb 28, 2026
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 3 */}
                        <div className="relative group">
                            <div className="absolute -left-[51px] md:-left-[91px] top-1.5 w-6 h-6 rounded-full bg-slate-600 ring-8 ring-slate-900 group-hover:bg-purple-500 transition-colors duration-300"></div>
                            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-[2rem] p-8 md:p-12 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/10">
                                <span className="text-slate-400 group-hover:text-purple-400 transition-colors font-bold tracking-widest text-sm md:text-base uppercase mb-3 block opacity-80">Phase 3</span>
                                <h3 className="text-3xl md:text-4xl font-black mb-4">Final Pitches & Judging</h3>
                                <p className="text-lg md:text-xl text-slate-300 font-medium mb-8 leading-relaxed max-w-3xl">Submit designated repositories. The countdown ends. Top teams will pitch their prototypes and business models live to our panel of judges.</p>
                                <div className="inline-flex items-center gap-3 text-base font-semibold text-white bg-white/10 py-3 px-6 rounded-xl border border-white/5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 group-hover:text-purple-300"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    1st March, 2026
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Pre-Footer */}
            <section className="py-24 sm:py-32 px-6 bg-brand-primary text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-8">Ready to register?</h2>
                    <p className="text-blue-100 text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto leading-relaxed">Gather your squad. Requires ADYPU University email (@adypu.edu.in) to bypass the gate and solidify your team's application.</p>
                    <button
                        onClick={handleLogin}
                        className="bg-white text-brand-primary hover:bg-slate-50 text-xl md:text-2xl font-bold py-6 px-14 rounded-full shadow-2xl hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
                    >
                        Sign In to Register
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 text-center bg-slate-950 text-slate-500 font-medium border-t border-slate-900 border-opacity-50 text-base">
                <p>&copy; 2026 IDEATHON ADYPU. All rights reserved.</p>
            </footer>

        </div>
    );
}
