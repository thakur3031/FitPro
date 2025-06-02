import { supabase } from '../supabaseClient'; // Adjusted path

// Sign up a new user
const signUp = async (email, password, additionalData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: additionalData, // e.g., username, first_name. Will be in user_metadata
    },
  });
  if (error) throw error;
  // Supabase handles email confirmation if enabled in your Supabase project settings.
  // The user object in `data.user` might be null until email is confirmed.
  return data;
};

// Sign in an existing user
const signInWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  // Session is automatically managed by the Supabase client library.
  // `data.session` contains the session info, `data.user` the user info.
  return data;
};

// Sign out the current user
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // Local session is cleared by the Supabase client library.
};

// Get the current session (if one exists)
// Useful for initial app load to check if user is already logged in.
const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error; // Should not typically happen for getSession
  return data.session;
};

// Listen to authentication state changes
// This is powerful for updating UI in real-time when auth state changes.
// Callback will receive the event (e.g., 'SIGNED_IN', 'SIGNED_OUT') and session.
const onAuthStateChange = (callback) => {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  // Return the subscription object so it can be unsubscribed if needed
  return authListener;
};

// Get the current user object
// Note: Supabase client often manages user data, but this can be a direct way.
const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};


const authService = {
  signUp,
  signInWithPassword,
  signOut,
  getSession,
  onAuthStateChange,
  getCurrentUser,
};

export default authService;
