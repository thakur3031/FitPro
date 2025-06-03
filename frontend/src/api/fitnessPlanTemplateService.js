import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated trainer's user ID
const getTrainerUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  return user.id;
};

// Get all plan templates for the logged-in trainer
const getPlanTemplates = async () => {
  const trainerId = await getTrainerUserId();
  const { data, error } = await supabase
    .from('fitness_plan_templates')
    .select('*')
    .eq('trainer_user_id', trainerId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching plan templates:', error);
    throw error;
  }
  return data || [];
};

// Get a single plan template with its items and exercise details using RPC
const getPlanTemplateDetails = async (planTemplateId) => {
  if (!planTemplateId) {
    throw new Error("Plan Template ID is required.");
  }
  const { data, error } = await supabase.rpc('get_plan_template_with_items_and_exercises', {
    p_plan_template_id: planTemplateId,
  });

  if (error) {
    console.error(`Error fetching details for plan template ${planTemplateId}:`, error);
    throw error;
  }
  // The RPC returns a single JSONB object: { plan: {...}, items: [...] }
  return data;
};

// Create a new fitness plan template
const createPlanTemplate = async (planData) => {
  const trainerId = await getTrainerUserId();
  const { name, description, duration_weeks, days_per_week, items = [] } = planData;

  // 1. Create the main plan template record
  const { data: newPlan, error: planError } = await supabase
    .from('fitness_plan_templates')
    .insert([{
      trainer_user_id: trainerId,
      name,
      description,
      duration_weeks,
      days_per_week,
    }])
    .select()
    .single();

  if (planError) {
    console.error('Error creating plan template:', planError);
    throw planError;
  }
  if (!newPlan) {
    throw new Error('Failed to create plan template record.');
  }

  // 2. Create the associated items
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      plan_template_id: newPlan.id,
      exercise_template_id: item.exercise_template_id, // Ensure this ID is correctly passed
      day_of_week: item.day_of_week,
      exercise_order: item.exercise_order,
      custom_params: item.custom_params || {}, // Ensure it's an object
      notes: item.notes,
    }));

    const { error: itemsError } = await supabase
      .from('fitness_plan_template_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating plan template items:', itemsError);
      // Optionally, attempt to delete the created plan template record for atomicity,
      // though true transactions are better handled by Edge Functions.
      await supabase.from('fitness_plan_templates').delete().eq('id', newPlan.id);
      throw itemsError;
    }
  }
  // Return the created plan with its (empty or populated) items list.
  // The getPlanTemplateDetails RPC is better for fetching the complete structure.
  return { ...newPlan, items }; // Or just newPlan and refetch details
};

// Update an existing fitness plan template
const updatePlanTemplate = async (planTemplateId, planData) => {
  const trainerId = await getTrainerUserId();
  const { name, description, duration_weeks, days_per_week, items = [] } = planData;

  // 1. Update the main plan template record
  const { data: updatedPlan, error: planError } = await supabase
    .from('fitness_plan_templates')
    .update({
      name,
      description,
      duration_weeks,
      days_per_week,
    })
    .eq('id', planTemplateId)
    .eq('trainer_user_id', trainerId) // Ensure trainer owns this template
    .select()
    .single();

  if (planError) {
    console.error(`Error updating plan template ${planTemplateId}:`, planError);
    throw planError;
  }
  if (!updatedPlan) {
    throw new Error('Failed to update plan template record or unauthorized.');
  }

  // 2. Update items: Delete existing items and re-insert new ones (simplest approach for now)
  // More granular updates (diffing) are complex without transaction guarantees client-side.
  const { error: deleteError } = await supabase
    .from('fitness_plan_template_items')
    .delete()
    .eq('plan_template_id', planTemplateId);

  if (deleteError) {
    console.error(`Error deleting old items for plan template ${planTemplateId}:`, deleteError);
    throw deleteError;
  }

  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      plan_template_id: planTemplateId,
      exercise_template_id: item.exercise_template_id,
      day_of_week: item.day_of_week,
      exercise_order: item.exercise_order,
      custom_params: item.custom_params || {},
      notes: item.notes,
    }));

    const { error: itemsError } = await supabase
      .from('fitness_plan_template_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error(`Error inserting new items for plan template ${planTemplateId}:`, itemsError);
      throw itemsError;
    }
  }
  return updatedPlan; // Or refetch details using RPC
};

// Delete a fitness plan template
const deletePlanTemplate = async (planTemplateId) => {
  const trainerId = await getTrainerUserId();
  // RLS should ensure that items are also deleted if cascade is set up,
  // or items need to be deleted manually first if not.
  // Assuming cascade delete on `fitness_plan_template_items` via foreign key `plan_template_id`.
  const { error } = await supabase
    .from('fitness_plan_templates')
    .delete()
    .eq('id', planTemplateId)
    .eq('trainer_user_id', trainerId);

  if (error) {
    console.error(`Error deleting plan template ${planTemplateId}:`, error);
    throw error;
  }
  return { message: 'Plan template deleted successfully' };
};


const fitnessPlanTemplateService = {
  getPlanTemplates,
  getPlanTemplateDetails,
  createPlanTemplate,
  updatePlanTemplate,
  deletePlanTemplate,
};

export default fitnessPlanTemplateService;
