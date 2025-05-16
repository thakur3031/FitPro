import * as Icons from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Action {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendedActionsCardProps {
  actions: Action[];
}

const RecommendedActionsCard: React.FC<RecommendedActionsCardProps> = ({ actions }) => {
  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="border-t-4 border-primary-500">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="mr-2 bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
            <Icons.BellIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <CardTitle>⚡ Your Next Recommended Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {sortedActions.length > 0 ? (
          <div className="space-y-4">
            {sortedActions.map((action) => (
              <div 
                key={action.id} 
                className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800"
              >
                <div className={`mr-3 p-2 rounded-full flex-shrink-0 ${
                  action.priority === 'high' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : action.priority === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{action.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex-shrink-0 mt-1" 
                  size="sm" 
                  onClick={action.onAction}
                >
                  {action.actionLabel}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icons.CheckIcon className="mx-auto h-12 w-12 text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-full" />
            <h3 className="mt-2 text-lg font-medium">All caught up!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              You have no pending actions right now.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedActionsCard;