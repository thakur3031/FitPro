import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import * as Icons from '@/lib/icons';
import ClientDashboard from '@/components/clients/ClientDashboard';
import { Activity, Target, TrendingUp, Clock, Search, Edit, MoreHorizontal, Mail, Phone, Calendar, Ruler, Weight, MapPin, User, ArrowLeft } from 'lucide-react';

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
    updatedAt: dbClient.created_at,
    membershipType: "Premium", // Default value
    location: "Not specified", // Default value
    status: "active" // Default value
  };
}

const ClientStats = () => {
  const stats = [
    { label: "Workouts Completed", value: "47", icon: Activity, color: "text-green-600" },
    { label: "Goals Achieved", value: "3", icon: Target, color: "text-blue-600" },
    { label: "Progress Score", value: "85%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Days Active", value: "127", icon: Clock, color: "text-orange-600" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function ClientProfilePage() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { id: clientId } = useParams();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      setError("Invalid or missing client ID in URL.");
      setLoading(false);
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
  }, [clientId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fb] via-[#f0f4f9] to-[#e8f2ff] dark:from-black dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading client profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fb] via-[#f0f4f9] to-[#e8f2ff] dark:from-black dark:via-slate-900 dark:to-slate-800">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Client</h3>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    )
  }

  if (!client) return <div>No client found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-[#f0f4f9] to-[#e8f2ff] dark:from-black dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Profile Header */}
          <div className="flex-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-xl overflow-hidden dark:bg-slate-900/90 dark:border-gray-800/50">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 h-32 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col md:flex-row items-start gap-6 -mt-16">
                  <Avatar className="h-32 w-32 ring-4 ring-white shadow-2xl">
                    <AvatarImage src={client.avatarUrl || "/placeholder.svg"} alt={client.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-bold">
                      {client.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 pt-16 md:pt-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 mb-2 mt-2">
                          {client.name}
                        </h1>
                        {client.username && (
                          <p className="text-gray-500 dark:text-gray-400 mb-3">@{client.username}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
                            {client.membershipType}
                          </Badge>
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-900/30">
                            {client.isActive ? "Active Member" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Born {new Date(client.dob).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{client.height} cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{client.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{client.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                      Member since {new Date(client.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Dashboard */}
            <ClientDashboard clientId={client.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 