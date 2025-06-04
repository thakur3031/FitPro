import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated trainer's user ID
const getTrainerUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  // Optionally, verify user role if applicable from 'profiles' or user_metadata
  return user.id;
};

// Get exercise templates (trainer's own and global ones)
const getExerciseTemplates = async () => {
  const trainerId = await getTrainerUserId();

  // Fetch templates specific to the trainer
  const { data: trainerTemplates, error: trainerError } = await supabase
    .from('exercise_templates')
    .select('*')
    .eq('trainer_user_id', trainerId)
    .order('name', { ascending: true });

  if (trainerError) {
    console.error('Error fetching trainer-specific exercise templates:', trainerError);
    throw trainerError;
  }

  // Fetch global templates (where trainer_user_id is NULL)
  const { data: globalTemplates, error: globalError } = await supabase
    .from('exercise_templates')
    .select('*')
    .is('trainer_user_id', null) // Using .is() for NULL check
    .order('name', { ascending: true });

  if (globalError) {
    console.error('Error fetching global exercise templates:', globalError);
    // Decide if you want to throw here or just return what was fetched successfully
    // For now, let's throw if there's an error fetching global templates as well
    throw globalError;
  }

  // Combine and return, ensuring no duplicates if a template somehow appears in both (shouldn't happen with this logic)
  return [...(trainerTemplates || []), ...(globalTemplates || [])];
};


// Create a new exercise template
const createExerciseTemplate = async (templateData) => {
  const trainerId = await getTrainerUserId();
  const dataToInsert = {
    ...templateData, // name, type, muscle_group, equipment, default_params (JSONB), notes
    trainer_user_id: trainerId, // Associate with the current trainer
  };

  // Validate default_params is valid JSON if it's a string
  if (typeof dataToInsert.default_params === 'string' && dataToInsert.default_params.trim() !== '') {
    try {
      JSON.parse(dataToInsert.default_params);
    } catch (e) {
      throw new Error('Default Parameters is not valid JSON.');
    }
  } else if (typeof dataToInsert.default_params !== 'object' && dataToInsert.default_params !== null && dataToInsert.default_params !== undefined && dataToInsert.default_params.trim() === '') {
     // If it's an empty string, treat as null or empty object
     dataToInsert.default_params = null;
  }


  const { data, error } = await supabase
    .from('exercise_templates')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error creating exercise template:', error);
    throw error;
  }
  return data;
};

// Update an existing exercise template
const updateExerciseTemplate = async (templateId, updateData) => {
  const trainerId = await getTrainerUserId(); // For RLS check if needed

  // Validate default_params is valid JSON if it's a string
  if (typeof updateData.default_params === 'string' && updateData.default_params.trim() !== '') {
    try {
      JSON.parse(updateData.default_params);
    } catch (e) {
      throw new Error('Default Parameters is not valid JSON.');
    }
  } else if (typeof updateData.default_params !== 'object' && updateData.default_params !== null && updateData.default_params !== undefined && updateData.default_params.trim() === '') {
    updateData.default_params = null;
 }


  const { data, error } = await supabase
    .from('exercise_templates')
    .update(updateData) // name, type, muscle_group, equipment, default_params, notes
    .eq('id', templateId)
    .eq('trainer_user_id', trainerId) // Ensure trainer can only update their own templates
    .select()
    .single();

  if (error) {
    console.error(`Error updating exercise template ${templateId}:`, error);
    throw error;
  }
  return data;
};

// Delete an exercise template
const deleteExerciseTemplate = async (templateId) => {
  const trainerId = await getTrainerUserId(); // For RLS check

  const { error } = await supabase
    .from('exercise_templates')
    .delete()
    .eq('id', templateId)
    .eq('trainer_user_id', trainerId); // Ensure trainer can only delete their own templates

  if (error) {
    console.error(`Error deleting exercise template ${templateId}:`, error);
    throw error;
  }
  return { message: 'Exercise template deleted successfully' };
};

const exerciseTemplateService = {
  getExerciseTemplates,
  createExerciseTemplate,
  updateExerciseTemplate,
  deleteExerciseTemplate,
};

export default exerciseTemplateService;
