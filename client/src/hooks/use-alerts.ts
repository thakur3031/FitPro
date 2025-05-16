import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Alert, Client } from "@shared/schema";

export const useAlerts = (trainerId: number = 1) => {
  const queryClient = useQueryClient();
  
  // Fetch all alerts for a trainer
  const { 
    data: alerts, 
    isLoading: isAlertsLoading,
    error: alertsError
  } = useQuery<Alert[]>({ 
    queryKey: [`/api/alerts?trainerId=${trainerId}`] 
  });
  
  // Fetch all clients for alert targeting
  const { 
    data: clients, 
    isLoading: isClientsLoading,
    error: clientsError
  } = useQuery<Client[]>({ 
    queryKey: [`/api/clients?trainerId=${trainerId}`] 
  });
  
  // Create a new alert
  const createAlert = useMutation({
    mutationFn: (alert: any) => 
      apiRequest("POST", "/api/alerts", alert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/alerts?trainerId=${trainerId}`] });
    },
  });
  
  // Mark alert as read
  const markAsRead = useMutation({
    mutationFn: (alertId: number) => 
      apiRequest("POST", `/api/alerts/${alertId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/alerts?trainerId=${trainerId}`] });
    },
  });
  
  // Delete alert
  const deleteAlert = useMutation({
    mutationFn: (alertId: number) => 
      apiRequest("DELETE", `/api/alerts/${alertId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/alerts?trainerId=${trainerId}`] });
    },
  });
  
  return {
    alerts,
    clients,
    isLoading: isAlertsLoading || isClientsLoading,
    error: alertsError || clientsError,
    createAlert,
    markAsRead,
    deleteAlert
  };
};
