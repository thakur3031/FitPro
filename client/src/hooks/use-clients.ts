import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Helper to map database fields to client interface
export interface MappedClient {
  client_id: number;
  trainerId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  username?: string | null;
  height?: number | null;
  weight?: number | null;
  dob?: string | null;
  genderName?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapClientFromDb(dbClient: any): MappedClient {
  return {
    client_id: dbClient.client_id,
    trainerId: dbClient.trainer_id,
    name: dbClient.cl_name,
    email: dbClient.cl_email,
    avatarUrl: dbClient.cl_pic,
    phone: dbClient.cl_phone,
    username: dbClient.cl_username,
    height: dbClient.cl_height,
    weight: dbClient.cl_weight,
    dob: dbClient.cl_dob,
    genderName: dbClient.cl_gender_name,
    isActive: true, // Since this isn't in the schema, we'll default to true
    createdAt: dbClient.created_at,
    updatedAt: dbClient.created_at // Using created_at as updatedAt isn't in schema
  };
}

export const useClients = (trainerId?: number) => {
  const queryClient = useQueryClient();
  
  // Fetch all clients for a trainer
  const { 
    data: clientsRaw, 
    isLoading,
    error
  } = useQuery<MappedClient[]>({ 
    queryKey: ['clients', trainerId],
    queryFn: async () => {
      if (!trainerId) return [];
      const { data, error } = await supabase
        .from('client')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ? data.map(mapClientFromDb) : [];
    },
    enabled: !!trainerId
  });
  
  // Create a new client
  const createClient = useMutation({
    mutationFn: async (client: Omit<MappedClient, 'id' | 'createdAt' | 'updatedAt'>) => {
      const mappedClient = {
        trainer_id: trainerId,
        cl_name: client.name,
        cl_email: client.email,
        cl_pic: client.avatarUrl,
        cl_phone: client.phone,
        cl_username: client.username,
        cl_height: client.height,
        cl_weight: client.weight,
        cl_dob: client.dob,
        cl_gender_name: client.genderName,
        cl_p: 'default_password'
      };
      const { data, error } = await supabase
        .from('client')
        .insert([mappedClient])
        .select()
        .single();
      if (error) throw error;
      return data ? mapClientFromDb(data) : null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', trainerId] });
    },
  });
  
  // Update an existing client
  const updateClient = useMutation({
    mutationFn: async ({ id, ...client }: { id: number } & Partial<MappedClient>) => {
      const mappedClient = {
        cl_name: client.name,
        cl_email: client.email,
        cl_pic: client.avatarUrl,
        cl_phone: client.phone,
        cl_username: client.username,
        cl_height: client.height,
        cl_weight: client.weight,
        cl_dob: client.dob,
        cl_gender_name: client.genderName
      };
      const { data, error } = await supabase
        .from('client')
        .update(mappedClient)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data ? mapClientFromDb(data) : null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', trainerId] });
    },
  });
  
  // Delete a client
  const deleteClient = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('client')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', trainerId] });
    },
  });
  
  return {
    clients: clientsRaw,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient
  };
};

export function useClientSchedule(clientId: number, weekStart: string, weekEnd: string) {
  return useQuery({
    queryKey: ['clientSchedule', clientId, weekStart, weekEnd],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('client_id', clientId)
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId && !!weekStart && !!weekEnd,
  });
}
