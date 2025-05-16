import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Icons from "@/lib/icons";

interface PaymentItem {
  icon: React.ReactNode;
  label: string;
}

interface ClientManagementCardProps {
  paymentItems?: PaymentItem[];
  onManage?: () => void;
}

const ClientManagementCard: React.FC<ClientManagementCardProps> = ({ 
  paymentItems = [
    { 
      icon: <Icons.DumbbellIcon className="h-5 w-5" />, 
      label: "Workout plans" 
    },
    { 
      icon: <Icons.ToothIcon className="h-5 w-5" />, 
      label: "Oral health check" 
    },
    { 
      icon: <Icons.BrainIcon className="h-5 w-5" />, 
      label: "Mindfulness practice" 
    }
  ],
  onManage 
}) => {
  const dummyClients = [
    { name: "Sarah Johnson", status: "Active", email: "sarah.j@example.com", goal: 80 },
    { name: "Tom Lee", status: "Inactive", email: "tom.lee@example.com", goal: 50 },
    { name: "Emily Smith", status: "Active", email: "emily.smith@example.com", goal: 95 },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden mr-4">
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
              alt="Client nutrition"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Client Management</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Efficiently manage clients</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="smart">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="ai">AI-Customize</TabsTrigger>
            <TabsTrigger value="smart">Smart Modular</TabsTrigger>
            <TabsTrigger value="task">Task-Minimize</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 overflow-x-auto py-3 mb-6 scrollbar-thin">
          <div className="px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 whitespace-nowrap">
            27 Clean
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 whitespace-nowrap">
            28 Priority
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 whitespace-nowrap border border-primary-300 dark:border-primary-700">
            29 Efficient
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 whitespace-nowrap">
            30 Custom
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 whitespace-nowrap">
            31 AI
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Payment tracking</h3>
          <div className="space-y-4">
            {paymentItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={onManage}
        >
          Manage
        </Button>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {dummyClients.map((client) => (
            <div key={client.email} className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-700">
              <div className="font-semibold text-lg">{client.name}</div>
              <div className="text-xs text-gray-500 mb-1">{client.email}</div>
              <span className={`inline-block px-2 py-1 text-xs rounded mb-2 ${client.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-700'}`}>{client.status}</span>
              <div className="mt-2 mb-2">
                <div className="text-xs text-gray-400 mb-1">Goal Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${client.goal}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{client.goal}%</div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">Nutritional Plan</Button>
                <Button size="sm" variant="outline">Fitness Plan</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientManagementCard;
