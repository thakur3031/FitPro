import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "@/lib/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import TrainingCalendar from "@/components/training/TrainingCalendar";

interface ClientDashboardProps {
  clientId: string;
}

const ClientStats = () => {
  const stats = [
    { label: "Workouts Completed", value: "47", icon: Icons.ActivityIcon, color: "text-green-600" },
    { label: "Goals Achieved", value: "3", icon: Icons.CheckIcon, color: "text-blue-600" },
    { label: "Progress Score", value: "85%", icon: Icons.ThumbsUpIcon, color: "text-purple-600" },
    { label: "Days Active", value: "127", icon: Icons.CalendarIcon, color: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
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
        );
      })}
    </div>
  );
};

const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - replace with real data from your API
  const metrics = {
    lastWeek: { completed: 3, total: 3 },
    lastMonth: { completed: 4, total: 4 },
    nextWeek: { assigned: 2 },
    weight: {
      current: 74.4,
      change: -0.4,
      history: [
        { date: "Week 1", value: 75.2 },
        { date: "Week 2", value: 74.8 },
        { date: "Week 3", value: 74.6 },
        { date: "Week 4", value: 74.4 }
      ]
    },
    sleep: {
      current: { hours: 6, minutes: 57 },
      history: [
        { date: "Week 1", value: 7.2 },
        { date: "Week 2", value: 6.8 },
        { date: "Week 3", value: 6.5 },
        { date: "Week 4", value: 6.9 }
      ]
    },
    heartRate: {
      current: 66,
      change: -5.7,
      history: [
        { date: "Week 1", value: 72 },
        { date: "Week 2", value: 68 },
        { date: "Week 3", value: 65 },
        { date: "Week 4", value: 66 }
      ]
    },
    steps: {
      current: 8381,
      history: [
        { date: "Week 1", value: 7500 },
        { date: "Week 2", value: 8200 },
        { date: "Week 3", value: 9000 },
        { date: "Week 4", value: 8381 }
      ]
    }
  };

  const clientInfo = {
    name: "Ben Andrew",
    email: "ben@demo",
    location: "AmericaLos,Angeles",
    timezone: "5:16 AM",
    goal: "Run a marathon without stopping to walk",
    upcomingEvent: {
      name: "10km City2Surf Fun Run",
      target: "in under 50m!",
      daysLeft: 36
    },
    notes: [
      { text: "Need program while traveling for 2 weeks", date: "May 19 - 3:56 PM" }
    ],
    limitations: [
      { text: "Leg injury last year", date: "May 5 - 3:56 PM" },
      { text: "Ben did a couple of physical therapy sessions in July 2018", date: "May 5 - 3:56 PM" }
    ],
    progressPhotos: [
      { date: "04/30", url: "/progress-1.jpg" },
      { date: "12/30", url: "/progress-2.jpg" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-[#f0f4f9] to-[#e8f2ff] dark:from-black dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4">
                <img
                  src={`/avatars/${clientId}.jpg`}
                  alt="Client Avatar"
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                    Client Profile
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Icons.PhoneIcon className="w-4 h-4" />
                    <span>Contact Information</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goals</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icons.FlameIcon className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">Primary Goal</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Set your primary fitness goal</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add important notes about the client</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Limitations</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add any physical limitations or injuries</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progress Photos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-32 flex items-center justify-center">
                        <Icons.ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-32 flex items-center justify-center">
                        <Icons.ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg dark:bg-slate-900/90 dark:border-gray-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Overview</TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Training</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Tasks</TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Metrics</TabsTrigger>
            <TabsTrigger value="food-journal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Food Journal</TabsTrigger>
            <TabsTrigger value="macros" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Macros</TabsTrigger>
            <TabsTrigger value="meal-plan" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Meal Plan</TabsTrigger>
            <TabsTrigger value="on-demand" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">On-demand</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Documents</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 dark:data-[state=active]:text-blue-400">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ClientStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        LAST 7 DAYS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {metrics.lastWeek.completed}/{metrics.lastWeek.total}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tracked</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        LAST 30 DAYS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {metrics.lastMonth.completed}/{metrics.lastMonth.total}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tracked</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        NEXT WEEK
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {metrics.nextWeek.assigned}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assigned</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">Body Metrics Overview</CardTitle>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last 4 weeks</div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.weight.current}</span>
                            <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">kg</span>
                            <span className={`text-sm ml-2 ${metrics.weight.change < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                              {metrics.weight.change}%
                            </span>
                          </div>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={metrics.weight.history}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="date" className="text-sm text-gray-500 dark:text-gray-400" />
                                <YAxis className="text-sm text-gray-500 dark:text-gray-400" />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.sleep.current.hours}h {metrics.sleep.current.minutes}min</span>
                          </div>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={metrics.sleep.history}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="date" className="text-sm text-gray-500 dark:text-gray-400" />
                                <YAxis className="text-sm text-gray-500 dark:text-gray-400" />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">Activity Metrics</CardTitle>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last 4 weeks</div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.heartRate.current}</span>
                            <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">bpm</span>
                            <span className={`text-sm ml-2 ${metrics.heartRate.change < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                              {metrics.heartRate.change}%
                            </span>
                          </div>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={metrics.heartRate.history}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="date" className="text-sm text-gray-500 dark:text-gray-400" />
                                <YAxis className="text-sm text-gray-500 dark:text-gray-400" />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.steps.current}</span>
                            <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">steps</span>
                          </div>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={metrics.steps.history}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="date" className="text-sm text-gray-500 dark:text-gray-400" />
                                <YAxis className="text-sm text-gray-500 dark:text-gray-400" />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Icons.PlusIcon className="w-4 h-4" />
                        Add Workout
                      </Button>
                      <Button className="w-full justify-start gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Icons.MessageCircleIcon className="w-4 h-4" />
                        Send Message
                      </Button>
                      <Button className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Icons.CalendarIcon className="w-4 h-4" />
                        Schedule Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-900/90 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Icons.ActivityIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Workout Completed</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Icons.CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Goal Achieved</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <Icons.MessageCircleIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">New Message</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="training">
            <div className="space-y-6">
              <TrainingCalendar clientId={clientId} />
            </div>
          </TabsContent>

          {/* Add other tab contents */}
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard; 