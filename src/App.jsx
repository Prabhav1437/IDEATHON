import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/LandingPage';
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
      <div className="flex w-full min-h-screen items-center justify-center bg-brand-bg">
        <div className="spinner !w-12 !h-12 !border-[4px] !border-brand-primary/20 !border-t-brand-primary drop-shadow-md"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-brand-bg font-inter w-full">
      {!session ? (
        <Login error={authError} />
      ) : (
        <div className="w-full max-w-[1020px] mx-auto flex flex-col items-end p-4 sm:p-8">
          <div className="flex justify-end mb-6">
            <button
              className="bg-white/60 hover:bg-white text-brand-text-muted hover:text-brand-error border border-brand-border/60 hover:border-red-200 shadow-sm backdrop-blur-sm px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-300 flex items-center gap-2 group"
              onClick={handleSignOut}
            >
              <span>Sign Out ({session.user.email})</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out opacity-70 group-hover:opacity-100"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            </button>
          </div>
          <RegistrationForm session={session} />
        </div>
      )}
    </div>
  );
}

export default App;
