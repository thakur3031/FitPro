import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '../api/authService'; // To access getSession or onAuthStateChange

const PrivateRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Check initial session state
    const currentSession = authService.getSession().then(sessionData => {
        setSession(sessionData); // sessionData can be null
        setLoading(false);
    }).catch(() => {
        setSession(null); // Ensure session is null on error
        setLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = authService.onAuthStateChange((event, sessionData) => {
      setSession(sessionData); // sessionData can be null if logged out
      setLoading(false); // Ensure loading is false after auth state changes
    });

    return () => {
      // Cleanup the listener when the component unmounts
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      } else if (authListener && authListener.subscription && typeof authListener.subscription.unsubscribe === 'function') {
        // Newer Supabase versions might return the subscription directly
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading authentication status...</div>; // Or a spinner component
  }

  // If there's no session, redirect to login.
  // Pass the current location to redirect back after successful login.
  return session ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
