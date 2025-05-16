import { useState } from "react";
import * as Icons from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const FitnessPlans = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [fitnessPlan, setFitnessPlan] = useState<string | null>(null);
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
    
    // Simulate plan generation
    setTimeout(() => {
      setIsGenerating(false);
      setFitnessPlan(`# Personalized Fitness Plan for ${formData.clientName}

## Program Overview
- **Fitness Level**: ${formData.fitnessLevel}
- **Weekly Frequency**: ${formData.workoutDays || "3-4"} days per week
- **Focus Areas**: ${formData.focusAreas || "Full body conditioning"}
${formData.limitations ? `- **Limitations/Considerations**: ${formData.limitations}` : ""}

## Weekly Schedule

### Monday - Upper Body
**Warm-up**: 5-10 minutes light cardio + dynamic stretching

**Main Workout**:
1. Push-ups: 3 sets of 10-12 reps
2. Dumbbell rows: 3 sets of 12 reps per arm
3. Shoulder press: 3 sets of 10-12 reps
4. Bicep curls: 3 sets of 12 reps
5. Tricep dips: 3 sets of 10-12 reps

**Cool down**: 5 minutes static stretching

### Wednesday - Lower Body
**Warm-up**: 5-10 minutes light cardio + dynamic stretching

**Main Workout**:
1. Bodyweight squats: 3 sets of 15 reps
2. Lunges: 3 sets of 12 reps per leg
3. Glute bridges: 3 sets of 15 reps
4. Calf raises: 3 sets of 15-20 reps
5. Wall sit: 3 sets of 30-45 seconds

**Cool down**: 5 minutes static stretching

### Friday - Full Body + Core
**Warm-up**: 5-10 minutes light cardio + dynamic stretching

**Main Workout**:
1. Burpees: 3 sets of 10 reps
2. Mountain climbers: 3 sets of 20 reps
3. Plank: 3 sets of 30-45 seconds
4. Russian twists: 3 sets of 15 reps per side
5. Bicycle crunches: 3 sets of 15 reps per side

**Cool down**: 5 minutes static stretching

## Progression
- Increase reps by 1-2 each week
- After 4 weeks, reassess and adjust program
- Add weights when bodyweight exercises become too easy

## Recovery
- Ensure adequate sleep (7-8 hours)
- Maintain proper hydration
- Active recovery on rest days (walking, light stretching)
- Monitor for signs of overtraining

## Notes
Emphasize proper form over rep counts. Record workouts and progress to stay motivated.
      `);
      
      toast({
        title: "Fitness Plan Generated",
        description: "Your customized fitness plan is ready to review.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Fitness Plan Generator</h1>
      
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Personalized Fitness Plan</CardTitle>
              <CardDescription>
                Create a customized workout regimen based on client fitness level and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input 
                      id="clientName" 
                      name="clientName" 
                      placeholder="Enter client name" 
                      value={formData.clientName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workoutDays">Workout Days per Week</Label>
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
                    <Label htmlFor="fitnessLevel">Fitness Level</Label>
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
                    <Label htmlFor="focusAreas">Focus Areas</Label>
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
                  <Label htmlFor="limitations">Physical Limitations/Injuries</Label>
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
                      <Icons.DumbbellIcon className="mr-2 h-4 w-4" />
                      Generate Fitness Plan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {fitnessPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Fitness Plan</CardTitle>
                <CardDescription>
                  Review and customize this plan before assigning to your client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="text-sm p-4 bg-slate-100 dark:bg-slate-800 rounded-md whitespace-pre-wrap">
                    {fitnessPlan}
                  </pre>
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
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Fitness Plans</CardTitle>
              <CardDescription>
                Access and manage all your saved workout plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Icons.ClipboardIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">No saved plans yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Generate your first fitness plan to see it here
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[value="generator"]')?.dispatchEvent(new Event('click'))}>
                  <Icons.PlusIcon className="mr-2 h-4 w-4" />
                  Create New Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FitnessPlans;