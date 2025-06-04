import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated client's user ID
const getClientUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  // Optionally, verify user role if applicable from 'profiles' or user_metadata
  return user.id;
};

// Fetch all measurements for the logged-in client, ordered by date
const getClientMeasurements = async () => {
  const clientUserId = await getClientUserId();

  const { data, error } = await supabase
    .from('client_measurements')
    .select('*') // Select all fields relevant for charts and display
    .eq('client_user_id', clientUserId)
    .order('measurement_date', { ascending: true });

  if (error) {
    console.error('Error fetching client measurements:', error);
    throw error;
  }
  return data || []; // Ensure an array is returned
};

// Fetch all goals for the logged-in client
const getClientGoals = async () => {
  const clientUserId = await getClientUserId();

  const { data, error } = await supabase
    .from('client_goals')
    .select('*') // Select all fields relevant for display
    .eq('client_user_id', clientUserId)
    .order('target_date', { ascending: true, nullsFirst: false }) // Example ordering
    .order('created_at', { ascending: false });


  if (error) {
    console.error('Error fetching client goals:', error);
    throw error;
  }
  return data || []; // Ensure an array is returned
};

const clientDataService = {
  getClientMeasurements,
  getClientGoals,
};

export default clientDataService;
