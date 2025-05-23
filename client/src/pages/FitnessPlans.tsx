import { useState } from "react";
import { usePlans } from "@/hooks/use-plans";
import PlanCard from "@/components/plans/PlanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plan } from "@shared/schema";
import PlanForm from "@/components/plans/PlanForm";
import * as Icons from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const FitnessPlans: React.FC = () => {
  const { plans, isLoading } = usePlans();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const { toast } = useToast();

  // AI Generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPlan, setAIPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    fitnessLevel: "beginner",
    workoutDays: "",
    focusAreas: "",
    limitations: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAIPlan(`# Personalized Fitness Plan for ${formData.clientName}\n\n...AI generated content...`);
      toast({
        title: "Fitness Plan Generated",
        description: "Your customized fitness plan is ready to review.",
      });
    }, 2000);
  };

  const fitnessPlans = plans?.filter((plan) => plan.type === "fitness" && (plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || (plan.description && plan.description.toLowerCase().includes(searchQuery.toLowerCase()))));

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsFormModalOpen(true);
  };

  const handleView = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsViewModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPlan(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    toast({
      title: selectedPlan ? "Plan updated" : "Plan created",
      description: selectedPlan ? "The plan has been successfully updated." : "The plan has been successfully created.",
    });
  };

  // Helper to render exercises in a plan (if available)
  const renderExercises = (plan: Plan) => {
    let content = plan.content;
    if (typeof content === "string") {
      try { content = JSON.parse(content); } catch {}
    }
    if (!content?.weeks) return null;
    return content.weeks.map((week: any, wIdx: number) => (
      <div key={wIdx} className="mb-6">
        <h4 className="font-semibold text-lg mb-2">{week.name}</h4>
        {week.days.map((day: any, dIdx: number) => (
          <div key={dIdx} className="mb-4">
            <div className="font-medium text-base mb-1">{day.name}</div>
            {day.exercises && day.exercises.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Image</th>
                      <th className="p-2 text-left">Exercise</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-left">Reps</th>
                      <th className="p-2 text-left">Rest</th>
                      <th className="p-2 text-left">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.exercises.map((ex: any, eIdx: number) => (
                      <tr key={eIdx} className="border-b">
                        <td className="p-2">
                          {ex.imageUrl ? (
                            <img src={ex.imageUrl} alt={ex.name} className="w-14 h-14 object-cover rounded" />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded">
                              <Icons.DumbbellIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="p-2 font-medium">{ex.name}</td>
                        <td className="p-2">{ex.description || "-"}</td>
                        <td className="p-2">{ex.reps || "-"}</td>
                        <td className="p-2">{ex.rest || "-"}</td>
                        <td className="p-2">{ex.frequency || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground italic">No exercises for this day.</div>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="offcanvas">{/* Sidebar menu items here */}</Sidebar>
        <SidebarContent>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold">Fitness Plan Library</h1>
              <div className="flex w-full sm:w-auto gap-2">
                <Button onClick={handleAddNew}>
                  <Icons.PlusIcon className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
                <Button variant="outline" onClick={() => setShowAIGenerator(true)}>
                  <Icons.SparklesIcon className="h-4 w-4 mr-2" />
                  AI Generate Plan
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search fitness plans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-md border border-gray-200 dark:border-gray-700 h-48 animate-pulse bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            ) : fitnessPlans && fitnessPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fitnessPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={handleEdit}
                    onView={handleView}
                    onAssign={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icons.ClipboardIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">No fitness plans yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Generate or create your first fitness plan.
                </p>
                <Button variant="outline" onClick={() => setShowAIGenerator(true)}>
                  <Icons.SparklesIcon className="h-4 w-4 mr-2" />
                  AI Generate Plan
                </Button>
              </div>
            )}
            {/* Plan Form Modal */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPlan ? "Edit Plan" : "Create New Plan"}
                  </DialogTitle>
                </DialogHeader>
                <PlanForm
                  plan={selectedPlan ?? undefined}
                  onSuccess={handleFormSuccess}
                  trainerId={1}
                />
              </DialogContent>
            </Dialog>
            {/* Plan View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPlan?.name || "Plan Details"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</h4>
                    <p>{selectedPlan?.type.charAt(0).toUpperCase() + (selectedPlan?.type.slice(1) || "")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                    <p>{selectedPlan?.description || "No description provided."}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Exercises</h4>
                    {selectedPlan && renderExercises(selectedPlan)}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* AI Generator Modal */}
            <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>AI Generate Fitness Plan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleGeneratePlan} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="clientName" className="font-medium">Client Name</label>
                      <Input
                        id="clientName"
                        name="clientName"
                        placeholder="Enter client name"
                        value={formData.clientName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="workoutDays" className="font-medium">Workout Days per Week</label>
                      <Input
                        id="workoutDays"
                        name="workoutDays"
                        placeholder="e.g. 3-5"
                        type="number"
                        min="1"
                        max="7"
                        value={formData.workoutDays}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="fitnessLevel" className="font-medium">Fitness Level</label>
                      <select
                        id="fitnessLevel"
                        name="fitnessLevel"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.fitnessLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="athletic">Athletic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="focusAreas" className="font-medium">Focus Areas</label>
                      <Input
                        id="focusAreas"
                        name="focusAreas"
                        placeholder="e.g. Upper body, core strength"
                        value={formData.focusAreas}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="limitations" className="font-medium">Physical Limitations/Injuries</label>
                    <textarea
                      id="limitations"
                      name="limitations"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="List any injuries, mobility issues or areas to avoid"
                      value={formData.limitations}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Icons.SparklesIcon className="mr-2 h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                  {aiPlan && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Generated Fitness Plan</CardTitle>
                        <CardDescription>Review and customize this plan before assigning to your client</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                          <pre className="text-sm p-4 bg-slate-100 dark:bg-slate-800 rounded-md whitespace-pre-wrap">{aiPlan}</pre>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline">
                            <Icons.PencilIcon className="mr-2 h-4 w-4" />
                            Edit Plan
                          </Button>
                          <Button>
                            <Icons.UserPlusIcon className="mr-2 h-4 w-4" />
                            Assign to Client
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};

export default FitnessPlans;