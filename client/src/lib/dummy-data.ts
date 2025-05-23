import { supabase } from './supabase';

export async function insertDummyClient() {
  const dummyClient = {
    trainer_id: 1, // Default trainer ID
    cl_name: "John Doe",
    cl_username: "johndoe",
    cl_email: "john.doe@example.com",
    cl_pic: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    cl_phone: "+1 (555) 123-4567",
    cl_height: 175,
    cl_weight: 75,
    cl_dob: "1990-01-01",
    cl_gender_name: "Male",
    cl_p: "password123" // This should be properly hashed in a real application
  };

  console.log('Attempting to insert dummy client:', dummyClient);

  try {
    const { data, error } = await supabase
      .from('client')
      .insert([dummyClient])
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting client:', error);
      throw error;
    }

    console.log('Successfully inserted client:', data);
    return data;
  } catch (error) {
    console.error('Error in insertDummyClient:', error);
    throw error;
  }
} 