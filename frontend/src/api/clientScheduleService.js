import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated client's user ID
const getClientUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  // Optionally, check if user_role is 'client' if your 'profiles' table has such a role
  return user.id;
};

/**
 * Fetches combined schedule data (appointments, nutrition items, fitness items) for the logged-in client.
 * Uses the RPC function `get_client_schedule_details`.
 * The RPC is expected to be created in Supabase by the developer.
 *
 * Note: The RPC provided in the task description does not include date range parameters.
 * Filtering by date range would typically be done on the frontend after fetching all active plan items
 * or by modifying the RPC to accept date range parameters.
 * For this implementation, we fetch all relevant items and the frontend will handle grouping/sorting.
 */
const getClientScheduleData = async () => {
  const clientUserId = await getClientUserId();

  const { data, error } = await supabase.rpc('get_client_schedule_details', {
    p_client_user_id: clientUserId,
  });

  if (error) {
    console.error('Error fetching client schedule data via RPC:', error);
    throw error;
  }

  // The RPC returns a flat list of items.
  // Each item has an 'item_type' ('appointment', 'nutrition', 'fitness').
  // Appointments have 'start_time' and 'end_time'.
  // Nutrition/Fitness items have 'day_of_week' and might be considered "all-day" or for specific meal times.
  // Further processing (sorting, grouping by date) will be needed on the frontend.
  return data || []; // Ensure an array is returned
};

const clientScheduleService = {
  getClientScheduleData,
};

export default clientScheduleService;
