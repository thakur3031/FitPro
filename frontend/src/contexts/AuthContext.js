import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../api/authService'; // To use onAuthStateChange and getCurrentUser

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null); // Supabase session object
  const [user, setUser] = useState(null); // Supabase user object (from session or auth.getUser())
  const [loading, setLoading] = useState(true); // For initial auth state check

  useEffect(() => {
    // Check for existing session on initial load
    authService.getSession().then(sessionData => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null); // Set user from session
      setLoading(false);
    }).catch(() => {
      // Handle error if needed, ensure loading is false
      setLoading(false);
    });

    // Listen to auth state changes
    const authListener = authService.onAuthStateChange(async (event, sessionData) => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null); // Update user based on new session

      // If user signed in and we want to fetch profile data from a 'profiles' table
      // if (event === 'SIGNED_IN' && sessionData?.user) {
      //   // Example: fetchUserProfile(sessionData.user.id);
      // } else if (event === 'SIGNED_OUT') {
      //   // Clear profile data
      // }

      // No need to set loading to false here again unless it's for specific post-auth actions
    });

    return () => {
      // Cleanup listener
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      } else if (authListener && authListener.subscription && typeof authListener.subscription.unsubscribe === 'function') {
         authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Value provided to context consumers
  const value = {
    session,
    user,
    loadingAuth: loading, // Renamed to avoid conflict if children use 'loading'
    // Future: add functions like signIn, signOut, signUp if you want them callable via context
    // For now, these are in authService.js and used directly by pages
  };

  // Don't render children until initial auth check is complete
  // if (loading) {
  //   return <div>Loading application...</div>; // Or a global spinner
  // }
  // The above loading screen might be too intrusive.
  // PrivateRoute already handles its own loading for auth status.
  // So, we can render children and let PrivateRoute/pages handle loading UI.

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
