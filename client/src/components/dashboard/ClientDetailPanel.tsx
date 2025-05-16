import * as Icons from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ClientDetailPanelProps {
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
    startDate: Date;
    status: 'active' | 'inactive' | 'pending';
    goals: string[];
    metrics: {
      weight: number;
      height: number;
      bodyFat?: number;
      bmi?: number;
    };
    assignedPlans: {
      id: number;
      name: string;
      type: 'fitness' | 'nutrition' | 'combined';
      progress: number;
    }[];
    notes: {
      id: number;
      content: string;
      date: Date;
    }[];
  } | null;
}

const ClientDetailPanel: React.FC<ClientDetailPanelProps> = ({ client }) => {
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Icons.UserIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No client selected</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select a client to view their details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
            <span className="text-2xl font-semibold text-primary-700 dark:text-primary-300">
              {client.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{client.name}</h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Badge className={
                client.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : client.status === 'pending'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }>
                {client.status}
              </Badge>
              <span className="ml-2">• Client since {client.startDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.MessageCircleIcon className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button size="sm">
            <Icons.ActivityIcon className="h-4 w-4 mr-2" />
            Session
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <Icons.MessageCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Icons.PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Metrics</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Weight</div>
                      <div className="font-medium">{client.metrics.weight} kg</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Height</div>
                      <div className="font-medium">{client.metrics.height} cm</div>
                    </div>
                    {client.metrics.bodyFat && (
                      <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Body Fat</div>
                        <div className="font-medium">{client.metrics.bodyFat}%</div>
                      </div>
                    )}
                    {client.metrics.bmi && (
                      <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">BMI</div>
                        <div className="font-medium">{client.metrics.bmi}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Goals</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {client.goals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-primary-50 dark:bg-primary-900/20">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full">
                  <Icons.PencilIcon className="h-4 w-4 mr-2" />
                  Edit Client Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {client.assignedPlans.length > 0 ? (
                <div className="space-y-4">
                  {client.assignedPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            {plan.type === 'fitness' ? (
                              <Icons.DumbbellIcon className="h-4 w-4 mr-2 text-blue-500" />
                            ) : plan.type === 'nutrition' ? (
                              <Icons.UtensilsIcon className="h-4 w-4 mr-2 text-green-500" />
                            ) : (
                              <Icons.ActivityIcon className="h-4 w-4 mr-2 text-purple-500" />
                            )}
                            <h4 className="font-medium">{plan.name}</h4>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Type: {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Icons.EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Icons.PlusIcon className="h-4 w-4 mr-2" />
                    Assign New Plan
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Icons.ClipboardIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold">No plans assigned</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Assign your first plan to this client
                  </p>
                  <Button>
                    <Icons.PlusIcon className="h-4 w-4 mr-2" />
                    Assign Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Icons.ActivityIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">No progress data yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start tracking progress to see data here
                </p>
                <Button>
                  <Icons.PlusIcon className="h-4 w-4 mr-2" />
                  Add Progress Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Session Notes</CardTitle>
              <Button size="sm">
                <Icons.PlusIcon className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              {client.notes.length > 0 ? (
                <div className="space-y-4">
                  {client.notes.map((note) => (
                    <div key={note.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {note.date.toLocaleDateString()}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Icons.MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 whitespace-pre-line">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Icons.ScrollIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold">No notes yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Add your first note about this client
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailPanel;