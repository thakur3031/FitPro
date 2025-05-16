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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@shared/schema";
import PlanForm from "@/components/plans/PlanForm";
import * as Icons from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

const Plans: React.FC = () => {
  const { plans, isLoading } = usePlans();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredPlans = plans
    ?.filter(
      (plan) =>
        (filterType === "all" || plan.type === filterType) &&
        (plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plan.description &&
            plan.description.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsFormModalOpen(true);
  };

  const handleView = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsViewModalOpen(true);
  };

  const handleAssign = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsAssignModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPlan(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    toast({
      title: selectedPlan ? "Plan updated" : "Plan created",
      description: selectedPlan
        ? "The plan has been successfully updated."
        : "The plan has been successfully created.",
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Fitness & Nutrition Plans</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <Button onClick={handleAddNew}>
            <Icons.PlusIcon className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search plans"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="nutrition">Nutrition</SelectItem>
            <SelectItem value="combined">Combined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-md border border-gray-200 dark:border-gray-700 h-48 animate-pulse bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : filteredPlans && filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onView={handleView}
              onAssign={handleAssign}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {plans && plans.length > 0 ? (
            <div>
              <Icons.SearchXIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div>
              <Icons.ClipboardIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold">No plans yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first fitness or nutrition plan.
              </p>
              <Button onClick={handleAddNew}>
                <Icons.PlusIcon className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>
          )}
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
            trainerId={1} // In a real app, this would be the logged-in trainer's ID
          />
        </DialogContent>
      </Dialog>

      {/* Plan View Modal - Simplified for this implementation */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
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
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plan Content</h4>
              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(selectedPlan?.content, null, 2)}
                </pre>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Plan Modal - Simplified placeholder */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Plan to Client</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Icons.UserPlusIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              This functionality would allow you to assign "{selectedPlan?.name}" to specific clients.
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsAssignModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plans;
