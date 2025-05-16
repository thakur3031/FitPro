import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@shared/schema";
import { usePlans } from "@/hooks/use-plans";

// Create a schema for plan validation
const planSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["fitness", "nutrition", "combined"]),
  content: z.object({
    notes: z.string().optional(),
    weeks: z.array(
      z.object({
        name: z.string(),
        days: z.array(
          z.object({
            name: z.string(),
            exercises: z.array(
              z.object({
                name: z.string(),
                sets: z.number().optional(),
                reps: z.number().optional(),
                duration: z.string().optional(),
                notes: z.string().optional(),
              })
            ).optional(),
            meals: z.array(
              z.object({
                name: z.string(),
                time: z.string().optional(),
                ingredients: z.array(z.string()).optional(),
                notes: z.string().optional(),
              })
            ).optional(),
          })
        ),
      })
    ).min(1, "At least one week is required"),
  }),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  plan?: Plan;
  onSuccess: () => void;
  trainerId: number;
}

const defaultWeek = {
  name: "Week 1",
  days: [
    { name: "Monday", exercises: [], meals: [] },
    { name: "Tuesday", exercises: [], meals: [] },
    { name: "Wednesday", exercises: [], meals: [] },
    { name: "Thursday", exercises: [], meals: [] },
    { name: "Friday", exercises: [], meals: [] },
    { name: "Saturday", exercises: [], meals: [] },
    { name: "Sunday", exercises: [], meals: [] },
  ],
};

const PlanForm: React.FC<PlanFormProps> = ({
  plan,
  onSuccess,
  trainerId,
}) => {
  const { createPlan, updatePlan } = usePlans();
  const isEditing = !!plan;

  // Parse the plan content if editing
  const parsedContent = isEditing 
    ? (typeof plan.content === 'string' 
        ? JSON.parse(plan.content) 
        : plan.content) 
    : { notes: "", weeks: [defaultWeek] };

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name || "",
      description: plan?.description || "",
      type: plan?.type || "fitness",
      content: parsedContent,
    },
  });

  const onSubmit = async (data: PlanFormValues) => {
    try {
      if (isEditing && plan) {
        await updatePlan.mutateAsync({
          id: plan.id,
          ...data,
        });
      } else {
        await createPlan.mutateAsync({
          trainerId,
          ...data,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter plan name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the plan"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="combined">Combined</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any general notes for this plan"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Plan Structure</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This is a simplified form. In a complete application, you would be able to add multiple weeks and customize days with exercises or meals.
          </p>
          
          <div className="text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-slate-800 rounded-md">
            {form.watch('type') === 'fitness' && (
              <div>Default fitness plan with 1 week added: 7 days with empty exercise slots.</div>
            )}
            {form.watch('type') === 'nutrition' && (
              <div>Default nutrition plan with 1 week added: 7 days with empty meal slots.</div>
            )}
            {form.watch('type') === 'combined' && (
              <div>Default combined plan with 1 week added: 7 days with both exercise and meal slots.</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={createPlan.isPending || updatePlan.isPending}
          >
            {isEditing ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlanForm;
