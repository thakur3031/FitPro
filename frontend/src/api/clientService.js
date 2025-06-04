import { supabase } from '../supabaseClient';
import authService from './authService'; // To get current user

// Helper to get current authenticated user's ID (trainer's ID)
const getTrainerUserId = async () => {
  const user = await authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated.');
  return user.id;
};

// Create a new client association and update/set their profile.
// Assumes client is an existing Supabase user.
const createClient = async (clientEmail, clientProfileData) => {
  const trainerId = await getTrainerUserId();

  // 1. Find the client user by email to get their ID
  // This requires a way to query users by email. Supabase doesn't allow direct user table queries by default from client-side.
  // This step usually requires a server-side function or admin privileges.
  // For now, let's assume we have a way to get client_user_id from email, or the form directly asks for client_user_id.
  // Let's modify this to expect client_user_id directly for simplicity as per task description option A.
  // The form will need a field for client_user_id.

  // If clientProfileData includes client_user_id:
  const clientUserId = clientProfileData.client_user_id;
  if (!clientUserId) {
    throw new Error("Client User ID is required to add a client.");
  }

  // 2. Update the client's profile in the 'profiles' table
  // RLS should allow trainers to update profiles of users they are about to add as clients, or this needs specific permissions.
  // For now, let's assume RLS allows updating full_name, avatar_url, phone_number, health_notes.
  // Do not update email here as it's part of auth.users.
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      full_name: clientProfileData.full_name,
      avatar_url: clientProfileData.avatar_url,
      phone_number: clientProfileData.phone_number, // Assuming these fields exist in profiles
      health_notes: clientProfileData.health_notes,
      // user_role: 'client' // Ensure user_role is 'client' if not already set
    })
    .eq('id', clientUserId);

  if (profileUpdateError) {
    console.error('Error updating client profile:', profileUpdateError);
    throw new Error(`Failed to update client profile: ${profileUpdateError.message}`);
  }

  // 3. Insert into the 'clients' table to link trainer and client
  const { data: clientLinkData, error: clientLinkError } = await supabase
    .from('clients')
    .insert([{
      trainer_user_id: trainerId,
      client_user_id: clientUserId,
      join_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    }])
    .select()
    .single();

  if (clientLinkError) {
    console.error('Error linking client:', clientLinkError);
    throw new Error(`Failed to link client: ${clientLinkError.message}`);
  }

  return clientLinkData;
};


// Get all clients for the current trainer
const getClients = async () => {
  const trainerId = await getTrainerUserId();
  const { data, error } = await supabase.rpc('get_trainer_clients', {
    p_trainer_user_id: trainerId,
  });

  if (error) {
    console.error('Error fetching clients via RPC:', error);
    throw error;
  }
  // The RPC returns client_id (which is profiles.id), and client_profile_id (also profiles.id)
  // We should map this to a consistent structure if needed, e.g., client.id = client_id
  return data.map(client => ({...client, id: client.client_id }));
};

// Get a single client's profile details
const getClient = async (client_user_id) => {
  // Trainer should only be able to get profiles of users who are their clients.
  // RLS policy on 'profiles' table should enforce this.
  // Or, we can first verify the client relationship.
  // For now, assume RLS handles it or direct profile fetch is okay for a linked client.
  const { data, error } = await supabase
    .from('profiles')
    .select('*') // Select all profile fields
    .eq('id', client_user_id)
    .single();

  if (error) {
    console.error(`Error fetching client profile ${client_user_id}:`, error);
    throw error;
  }
  return data;
};

// Update a client's profile
const updateClient = async (client_user_id, profileDataToUpdate) => {
  // Trainer should only update profiles of their own clients. RLS must enforce this.
  // Do not update email or role here directly unless specifically designed for.
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: profileDataToUpdate.full_name,
      avatar_url: profileDataToUpdate.avatar_url,
      phone_number: profileDataToUpdate.phone_number,
      health_notes: profileDataToUpdate.health_notes,
      // any other fields from 'profiles' table that a trainer can update
    })
    .eq('id', client_user_id)
    .select() // Return the updated profile
    .single();

  if (error) {
    console.error(`Error updating client profile ${client_user_id}:`, error);
    throw error;
  }
  return data;
};

// Delete a client (removes the link, does not delete user account)
const deleteClient = async (client_user_id) => {
  const trainerId = await getTrainerUserId();
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('trainer_user_id', trainerId)
    .eq('client_user_id', client_user_id);

  if (error) {
    console.error(`Error deleting client link for ${client_user_id}:`, error);
    throw error;
  }
  return { message: 'Client link removed successfully' };
};

const clientService = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
};

export default clientService;
