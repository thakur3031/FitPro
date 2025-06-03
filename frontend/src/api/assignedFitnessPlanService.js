import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current trainer's user ID

// Helper to get current authenticated trainer's user ID
const getTrainerUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  return user.id;
};

/**
 * Assigns a fitness plan (derived from a template or custom built) to a client.
 * @param {object} assignmentData - The data for the assignment.
 * @param {string} assignmentData.client_user_id - UUID of the client.
 * @param {number|null} assignmentData.source_plan_template_id - ID of the source template, if any.
 * @param {string} assignmentData.plan_name - Name of the plan for this assignment.
 * @param {string} assignmentData.plan_description - Description of the plan for this assignment.
 * @param {string} assignmentData.start_date - ISO date string (YYYY-MM-DD).
 * @param {string} assignmentData.end_date - ISO date string (YYYY-MM-DD).
 * @param {Array<object>} assignmentData.items - Array of exercise items for the plan.
 * Each item: { exercise_template_id, exercise_name (denormalized), day_of_week, exercise_order, custom_params, notes }
 */
const assignPlanToClient = async (assignmentData) => {
  const trainerId = await getTrainerUserId();

  const {
    client_user_id,
    source_plan_template_id = null, // Optional
    plan_name,
    plan_description,
    start_date,
    end_date,
    items = [] // These are the resolved items to be assigned
  } = assignmentData;

  if (!client_user_id || !plan_name || !start_date || !end_date) {
    throw new Error("Client, plan name, start date, and end date are required for assignment.");
  }

  // 1. Create a new record in public.fitness_plans
  const { data: newAssignedPlan, error: planError } = await supabase
    .from('fitness_plans') // This is the table for assigned plans
    .insert([{
      client_user_id,
      trainer_user_id: trainerId,
      source_plan_template_id,
      name: plan_name,
      description: plan_description,
      start_date,
      end_date,
      // status could be 'active', 'pending', etc. Add if your table has it.
    }])
    .select()
    .single();

  if (planError) {
    console.error('Error creating assigned fitness plan record:', planError);
    throw planError;
  }

  if (!newAssignedPlan) {
    throw new Error('Failed to create the assigned fitness plan record.');
  }

  // 2. Create corresponding records in public.fitness_plan_items
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      fitness_plan_id: newAssignedPlan.id, // Link to the newly created fitness_plans record
      exercise_template_id: item.exercise_template_id, // ID of the source exercise template
      // Denormalize exercise_name from item.exercise_details.name or item.exercise_name
      // The `items` array passed to this function should already have resolved exercise names.
      exercise_name: item.exercise_name || item.exercise_details?.name || 'Unnamed Exercise',
      day_of_week: item.day_of_week,
      exercise_order: item.exercise_order,
      // Ensure custom_params is an object, default to empty if undefined/null
      custom_params: (typeof item.custom_params === 'object' && item.custom_params !== null)
                      ? item.custom_params
                      : (item.exercise_details?.default_params || {}),
      notes: item.notes,
      // status for individual items could be 'pending', 'completed' etc.
    }));

    const { error: itemsError } = await supabase
      .from('fitness_plan_items') // This is the table for items of an assigned plan
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating assigned fitness plan items:', itemsError);
      // Attempt to delete the created fitness_plans record for some atomicity
      // This is a best-effort cleanup. True transactions are better with Edge Functions.
      await supabase.from('fitness_plans').delete().eq('id', newAssignedPlan.id);
      throw itemsError;
    }
  }

  return { ...newAssignedPlan, items }; // Return the assigned plan with its items
};

const assignedFitnessPlanService = {
  assignPlanToClient,
};

export default assignedFitnessPlanService;
