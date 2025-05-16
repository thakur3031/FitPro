import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Client, InsertClient } from "@shared/schema";

export const useClients = (trainerId: number = 1) => {
  const queryClient = useQueryClient();
  
  // Fetch all clients for a trainer
  const { 
    data: clients, 
    isLoading,
    error
  } = useQuery<Client[]>({ 
    queryKey: [`/api/clients?trainerId=${trainerId}`] 
  });
  
  // Create a new client
  const createClient = useMutation({
    mutationFn: (client: InsertClient) => 
      apiRequest("POST", "/api/clients", client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients?trainerId=${trainerId}`] });
    },
  });
  
  // Update an existing client
  const updateClient = useMutation({
    mutationFn: ({ id, ...client }: { id: number } & Partial<InsertClient>) => 
      apiRequest("PATCH", `/api/clients/${id}`, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients?trainerId=${trainerId}`] });
    },
  });
  
  // Delete a client
  const deleteClient = useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients?trainerId=${trainerId}`] });
    },
  });
  
  // Archive a client
  const archiveClient = useMutation({
    mutationFn: (id: number) => 
      apiRequest("POST", `/api/clients/${id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients?trainerId=${trainerId}`] });
    },
  });
  
  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    archiveClient
  };
};
