import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "@/lib/icons";
import { Plan } from "@shared/schema";

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onAssign: (plan: Plan) => void;
  onView: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onAssign, onView }) => {
  const getPlanTypeIcon = (type: string) => {
    switch (type) {
      case "fitness":
        return <Icons.DumbbellIcon className="h-4 w-4 mr-1" />;
      case "nutrition":
        return <Icons.UtensilsIcon className="h-4 w-4 mr-1" />;
      case "combined":
        return <Icons.ActivityIcon className="h-4 w-4 mr-1" />;
      default:
        return <Icons.ClipboardIcon className="h-4 w-4 mr-1" />;
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "fitness":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "nutrition":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "combined":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <Badge className={getPlanTypeColor(plan.type)}>
              <div className="flex items-center">
                {getPlanTypeIcon(plan.type)}
                <span>{plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}</span>
              </div>
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {plan.description || "No description provided."}
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Icons.CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              Created {new Date(plan.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-4 bg-white dark:bg-slate-800">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(plan)}
        >
          <Icons.PencilIcon className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onAssign(plan)}
        >
          <Icons.UserPlusIcon className="mr-2 h-4 w-4" />
          Assign
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onView(plan)}
        >
          <Icons.EyeIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
