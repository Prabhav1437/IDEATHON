import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionResult(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSessionResult(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionResult = async (currentSession) => {
    if (currentSession?.user) {
      const email = currentSession.user.email;
      if (!email.endsWith('@adypu.edu.in')) {
        await supabase.auth.signOut();
        setAuthError('Access denied. Please sign in with your @adypu.edu.in email address.');
        setSession(null);
      } else {
        setAuthError('');
        setSession(currentSession);
      }
    } else {
      setSession(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" style={{ borderTopColor: 'var(--primary-color)', borderWidth: '4px', width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="container">
      {!session ? (
        <Login error={authError} />
      ) : (
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', width: '100%' }}>
            <button
              className="btn-danger"
              onClick={handleSignOut}
              style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}
            >
              Sign Out ({session.user.email})
            </button>
          </div>
          <RegistrationForm session={session} />
        </div>
      )}
    </div>
  );
}

export default App;
