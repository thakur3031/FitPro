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
 * Uses the new RPC function `get_client_calendar_events`.
 * The RPC is expected to be created in Supabase by the developer.
 *
 * @param {string} startDate - The start of the date range (YYYY-MM-DD).
 * @param {string} endDate - The end of the date range (YYYY-MM-DD).
 */
const getClientCalendarEvents = async (startDate, endDate) => {
  const clientUserId = await getClientUserId();

  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required to fetch calendar events.");
  }

  const { data, error } = await supabase.rpc('get_client_calendar_events', {
    p_client_user_id: clientUserId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    console.error('Error fetching client calendar events via RPC:', error);
    throw error;
  }

  // The RPC returns a flat list of items formatted for FullCalendar:
  // id, title, start_time, end_time, all_day, item_type, description, plan_name,
  // meal_type, exercise_name, sets, reps, status
  return data || []; // Ensure an array is returned
};

const clientScheduleService = {
  getClientCalendarEvents, // Renamed from getClientScheduleData
};

export default clientScheduleService;
