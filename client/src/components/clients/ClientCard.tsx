import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "@/lib/icons";
import { Client } from "@shared/schema";

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onViewProfile: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onViewProfile }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              {client.avatarUrl ? (
                <img 
                  src={client.avatarUrl} 
                  alt={client.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                  <Icons.UserIcon className="h-7 w-7" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold truncate">{client.name}</h3>
                <Badge variant={client.isActive ? "default" : "secondary"}>
                  {client.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{client.email}</p>
              
              {client.goals && (
                <p className="text-sm line-clamp-2">{client.goals}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Icons.CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              Joined {new Date(client.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-4 bg-white dark:bg-slate-800">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(client)}
        >
          <Icons.PencilIcon className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onViewProfile(client)}
        >
          <Icons.UserIcon className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
