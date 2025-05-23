import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'wouter';
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
  console.log("ClientProfilePage loaded with clientId:", clientId);

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      setError("Invalid or missing client ID in URL.");
      setLoading(false);
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
  if (error) return <div className="text-red-600">{error}</div>;
  if (!client) return <div>No client found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile Header */}
      <Card className="flex flex-col md:flex-row items-center gap-6 p-6 mb-8">
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
  );
} 