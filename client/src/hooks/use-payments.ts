import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Payment, Client } from "@shared/schema";

export const usePayments = (trainerId: number = 1) => {
  const queryClient = useQueryClient();
  
  // Fetch all payments for a trainer
  const { 
    data: payments, 
    isLoading: isPaymentsLoading,
    error: paymentsError
  } = useQuery<Payment[]>({ 
    queryKey: [`/api/payments?trainerId=${trainerId}`] 
  });
  
  // Fetch all clients for payment selection
  const { 
    data: clients, 
    isLoading: isClientsLoading,
    error: clientsError
  } = useQuery<Client[]>({ 
    queryKey: [`/api/clients?trainerId=${trainerId}`] 
  });
  
  // Create a new payment
  const createPayment = useMutation({
    mutationFn: (payment: any) => 
      apiRequest("POST", "/api/payments", payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/payments?trainerId=${trainerId}`] });
    },
  });
  
  // Update an existing payment
  const updatePayment = useMutation({
    mutationFn: ({ id, ...payment }: { id: number } & Partial<any>) => 
      apiRequest("PATCH", `/api/payments/${id}`, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/payments?trainerId=${trainerId}`] });
    },
  });
  
  return {
    payments,
    clients,
    isLoading: isPaymentsLoading || isClientsLoading,
    error: paymentsError || clientsError,
    createPayment,
    updatePayment
  };
};
