import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plan } from "@shared/schema";

export const usePlans = (trainerId: number = 1) => {
  const queryClient = useQueryClient();
  
  // Fetch all plans for a trainer
  const { 
    data: plans, 
    isLoading,
    error
  } = useQuery<Plan[]>({ 
    queryKey: [`/api/plans?trainerId=${trainerId}`] 
  });
  
  // Create a new plan
  const createPlan = useMutation({
    mutationFn: (plan: any) => 
      apiRequest("POST", "/api/plans", plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/plans?trainerId=${trainerId}`] });
    },
  });
  
  // Update an existing plan
  const updatePlan = useMutation({
    mutationFn: ({ id, ...plan }: { id: number } & Partial<any>) => 
      apiRequest("PATCH", `/api/plans/${id}`, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/plans?trainerId=${trainerId}`] });
    },
  });
  
  // Delete a plan
  const deletePlan = useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/plans?trainerId=${trainerId}`] });
    },
  });
  
  // Assign a plan to a client
  const assignPlanToClient = useMutation({
    mutationFn: (clientPlan: any) => 
      apiRequest("POST", "/api/client-plans", clientPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-plans'] });
    },
  });
  
  return {
    plans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    assignPlanToClient
  };
};
