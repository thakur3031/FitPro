import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated user's ID (trainer's ID)
const getTrainerUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  return user.id;
};

// Create a new appointment
const createAppointment = async (appointmentData) => {
  const trainerId = await getTrainerUserId();
  const dataToInsert = {
    ...appointmentData, // Should include client_user_id, title, description, start_time, end_time, appointment_type, status
    trainer_user_id: trainerId,
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert([dataToInsert])
    .select() // Return the created record
    .single(); // Expect a single record back

  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
  return data;
};

// Get all appointments for the current trainer with client names
// Uses the RPC function: get_trainer_appointments_with_client_names
const getTrainerAppointments = async (/* startDate, endDate - Optional params for date range filtering if RPC is adapted */) => {
  const trainerId = await getTrainerUserId();
  const { data, error } = await supabase.rpc('get_trainer_appointments_with_client_names', {
    p_trainer_user_id: trainerId,
  });

  if (error) {
    console.error('Error fetching trainer appointments via RPC:', error);
    throw error;
  }
  // The RPC returns appointment_id, client_id, client_full_name, etc.
  // Map appointment_id to id for consistency if components expect `id`
  return data.map(app => ({ ...app, id: app.appointment_id }));
};

// Update an existing appointment
const updateAppointment = async (appointmentId, updateData) => {
  // Ensure RLS allows the trainer to update their own appointments.
  // updateData should contain fields to be updated, e.g., title, description, start_time, end_time, etc.
  const trainerId = await getTrainerUserId(); // For RLS check if needed, or rely on RLS policy with auth.uid()

  const { data, error } = await supabase
    .from('appointments')
    .update(updateData)
    .eq('id', appointmentId)
    .eq('trainer_user_id', trainerId) // Ensure trainer can only update their own appointments
    .select()
    .single();

  if (error) {
    console.error(`Error updating appointment ${appointmentId}:`, error);
    throw error;
  }
  return data;
};

// Delete an appointment
const deleteAppointment = async (appointmentId) => {
  // Ensure RLS allows the trainer to delete their own appointments.
  const trainerId = await getTrainerUserId(); // For RLS check

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)
    .eq('trainer_user_id', trainerId); // Ensure trainer can only delete their own appointments

  if (error) {
    console.error(`Error deleting appointment ${appointmentId}:`, error);
    throw error;
  }
  return { message: 'Appointment deleted successfully' };
};

const appointmentService = {
  createAppointment,
  getTrainerAppointments,
  updateAppointment,
  deleteAppointment,
};

export default appointmentService;
