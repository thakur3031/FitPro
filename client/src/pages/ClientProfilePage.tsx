import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as Icons from '@/lib/icons';
import { ClientDashboard } from '@/components/clients/ClientDashboard';

// Match the field mapping from use-clients
function mapClientFromDb(dbClient: any) {
  return {
    id: dbClient.id,
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
    isActive: true,
    createdAt: dbClient.created_at,
    updatedAt: dbClient.created_at
  };
}

export default function ClientProfilePage() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: clientId } = useParams();
  const [, navigate] = useLocation();
  console.log("ClientProfilePage loaded with clientId:", clientId);

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      setError("Invalid or missing client ID in URL.");
      setLoading(false);
      // Optionally auto-redirect after 2 seconds
      setTimeout(() => navigate('/clients'), 2000);
      return;
    }
    async function fetchData() {
      setLoading(true);
      setError(null);
      const { data: clientData, error: clientError } = await supabase
        .from('client')
        .select('*')
        .eq('client_id', Number(clientId))
        .eq('trainer_id', 1)
        .maybeSingle();
      if (clientError || !clientData) {
        setError('Failed to fetch client details');
        setLoading(false);
        return;
      }
      setClient(mapClientFromDb(clientData));
      setLoading(false);
    }
    fetchData();
  }, [clientId]);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="text-red-600 flex flex-col items-center gap-4 mt-12">
      <div>{error}</div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/clients')}
      >
        Back to Clients
      </button>
    </div>
  );
  if (!client) return <div>No client found.</div>;

  return (
    <div className="min-h-screen w-full flex flex-col justify-start bg-[#faf9f8]">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-2 mt-8 px-2 md:px-0">
        {/* Sidebar placeholder for alignment (can add real sidebar if needed) */}
        <div className="w-full md:w-72 flex flex-col gap-6 shrink-0"></div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Profile Header */}
          <Card className="flex flex-col md:flex-row items-center gap-6 p-6 mb-2">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {client.avatarUrl ? (
                <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
              ) : (
                <Icons.UserIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold mb-1">{client.name}</h2>
              {client.username && (
                <div className="text-gray-500 text-sm mb-1">@{client.username}</div>
              )}
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {client.email && <span className="text-gray-500">{client.email}</span>}
                {client.phone && <span className="text-gray-500">{client.phone}</span>}
              </div>
              <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                <span>DOB: {client.dob}</span>
                <span>Height: {client.height} cm</span>
                <span>Weight: {client.weight} kg</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Joined: {new Date(client.createdAt).toLocaleDateString()}</div>
            </div>
          </Card>
          {/* Client Dashboard and Schedule */}
          <ClientDashboard clientId={client.id} />
        </div>
      </div>
    </div>
  );
} 