import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated client's user ID
const getClientUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  return user.id;
};

/**
 * Fetches an activity log entry for a specific original item ID and scheduled date.
 * @param {string} originalItemId - The ID of the source item (e.g., 'appt-1', 'fit-item-3-20230101').
 * @param {string} scheduledDate - The specific date of the event instance (YYYY-MM-DD).
 * @param {string} itemType - The type of the item ('appointment', 'fitness', 'nutrition').
 */
const getActivityLogEntry = async (originalItemId, scheduledDate, itemType) => {
  const clientUserId = await getClientUserId();

  // The `id` field in FullCalendar events is unique per instance (e.g., 'fit-item-3-20230101')
  // We might want to log against this unique instance ID or the base item ID.
  // For now, let's assume originalItemId is the unique instance ID from FullCalendar.
  // The `client_activity_log` table should store this as `original_item_instance_id` or similar
  // if we want to log each occurrence of a recurring item.
  // Or, if originalItemId is just 'fit-item-3', then scheduled_date helps differentiate.

  // The task description uses original_item_id and scheduled_date for lookup.
  // The FullCalendar event.id is already unique per instance for recurring items in my RPC.

  const { data, error } = await supabase
    .from('client_activity_log')
    .select('*')
    .eq('client_user_id', clientUserId)
    .eq('original_item_id', originalItemId) // This should match the unique ID from FullCalendar event
    // .eq('scheduled_date', scheduledDate) // May not be needed if original_item_id is already date-specific for recurring items
    .eq('item_type', itemType) // Good to ensure type matching
    .maybeSingle(); // Expect 0 or 1 entry

  if (error) {
    console.error('Error fetching activity log entry:', error);
    throw error;
  }
  return data; // Returns the single entry or null
};


/**
 * Creates or updates an activity log entry.
 * @param {object} logData - The data for the log entry.
 * Required: client_user_id, original_item_id, item_type, title, scheduled_date, status.
 * Optional: client_notes, completion_details (JSONB), performed_date, source_item_table, etc.
 */
const upsertActivityLogEntry = async (logData) => {
  const clientUserId = await getClientUserId();

  const dataToUpsert = {
    ...logData,
    client_user_id: clientUserId,
    performed_date: logData.performed_date || new Date().toISOString(), // Default to now if not provided
    // Ensure `completion_details` is an object or null for JSONB
    completion_details: (typeof logData.completion_details === 'string' && logData.completion_details.trim() !== '')
                        ? JSON.parse(logData.completion_details)
                        : (typeof logData.completion_details === 'object' ? logData.completion_details : {}),
  };

  // Determine source_item_table based on item_type
  if (!dataToUpsert.source_item_table) {
    switch (dataToUpsert.item_type) {
      case 'appointment': dataToUpsert.source_item_table = 'appointments'; break;
      case 'fitness': dataToUpsert.source_item_table = 'fitness_plan_items'; break;
      case 'nutrition': dataToUpsert.source_item_table = 'nutrition_plan_items'; break;
      default: dataToUpsert.source_item_table = null;
    }
  }

  // We need a way to uniquely identify the log entry for upsert.
  // Using original_item_id (which is unique per calendar instance from our RPC) and client_user_id.
  // The `id` field of client_activity_log is BIGSERIAL.
  // If an existing `logData.id` is provided, it means we are updating that specific log.
  // Otherwise, we check if a log for this `original_item_id` exists.

  let existingLogId = logData.id || null;

  if (!existingLogId) {
    // Check if an entry already exists for this original_item_id by this user
    const { data: existing, error: fetchError } = await supabase
      .from('client_activity_log')
      .select('id')
      .eq('client_user_id', clientUserId)
      .eq('original_item_id', dataToUpsert.original_item_id)
      // .eq('scheduled_date', dataToUpsert.scheduled_date) // May not be needed if original_item_id is instance-specific
      .eq('item_type', dataToUpsert.item_type)
      .maybeSingle();

    if (fetchError) {
        console.error('Error checking for existing log entry:', fetchError);
        // Don't throw, proceed to insert, might fail if constraint exists
    }
    if (existing) {
        existingLogId = existing.id;
    }
  }

  let responseData, responseError;

  if (existingLogId) {
    // Update existing entry
    const { id, client_user_id, created_at, ...updateFields } = dataToUpsert; // Exclude fields not to be updated directly
    const { data, error } = await supabase
      .from('client_activity_log')
      .update(updateFields)
      .eq('id', existingLogId)
      .eq('client_user_id', clientUserId) // Ensure user owns the log
      .select()
      .single();
    responseData = data;
    responseError = error;
  } else {
    // Create new entry
    // Remove 'id' if it was part of logData but not for insert (e.g. null)
    const { id, ...insertFields } = dataToUpsert;
    const { data, error } = await supabase
      .from('client_activity_log')
      .insert([insertFields])
      .select()
      .single();
    responseData = data;
    responseError = error;
  }

  if (responseError) {
    console.error('Error upserting activity log entry:', responseError);
    throw responseError;
  }
  return responseData;
};


const clientActivityLogService = {
  getActivityLogEntry,
  upsertActivityLogEntry,
};

export default clientActivityLogService;
