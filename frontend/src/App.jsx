import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import ApplicationForm from './pages/ApplicationForm';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const email = user.email || '';
  if (!email.endsWith('@adypu.edu.in')) {
    // Optionally alert the user or redirect with a message
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={session?.user} />} />
        <Route
          path="/apply"
          element={
            <ProtectedRoute user={session?.user}>
              <ApplicationForm user={session?.user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
