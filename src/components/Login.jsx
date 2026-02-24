import React from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ error }) {
    const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
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
        <div className="card login-card">
            <div className="header-logo">
                <h1>IDEATHON 2026</h1>
                <p>Hackathon Team Registration</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <p style={{ marginBottom: '2rem' }}>
                Please sign in with your ADYPU university email (@adypu.edu.in) to access the registration form.
            </p>

            <button onClick={handleLogin}>
                Sign in with Google
            </button>
        </div>
    );
}
