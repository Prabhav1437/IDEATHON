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
        <div className="bg-brand-card rounded-2xl shadow-xl shadow-brand-text/5 p-8 w-full max-w-[400px] text-center animate-slide-up mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-brand-primary text-4xl font-bold tracking-tight mb-2">IDEATHON 2026</h1>
                <p className="text-lg text-brand-text-muted m-0">Hackathon Team Registration</p>
            </div>

            {error && (
                <div className="p-4 rounded-lg mb-6 text-sm font-medium text-center bg-brand-error-bg text-brand-error border border-[#fecaca]">
                    {error}
                </div>
            )}

            <p className="mb-8 text-brand-text-muted">
                Please sign in with your ADYPU university email (@adypu.edu.in) to access the registration form.
            </p>

            <button className="btn-primary" onClick={handleLogin}>
                Sign in with Google
            </button>
        </div>
    );
}
