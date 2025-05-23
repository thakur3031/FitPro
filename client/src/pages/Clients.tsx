import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import ClientCard from "@/components/clients/ClientCard";
import ClientProfileModal from "@/components/clients/ClientProfileModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client } from "@shared/schema";
import ClientForm from "@/components/clients/ClientForm";
import * as Icons from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { insertDummyClient } from "@/lib/dummy-data";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";

const Clients: React.FC = () => {
  // Use a default trainer ID of 1 for demonstration
  const { clients, isLoading, error } = useClients(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const { toast } = useToast();

  const handleAddDummyClient = async () => {
    setIsInserting(true);
    try {
      await insertDummyClient();
      toast({
        title: "Success",
        description: "Dummy client has been added successfully.",
      });
      // Force a refresh of the clients list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add dummy client",
        variant: "destructive",
      });
    } finally {
      setIsInserting(false);
    }
  };

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (client: Client) => {
    setSelectedClient(client);
    setIsProfileModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedClient(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    toast({
      title: selectedClient ? "Client updated" : "Client added",
      description: selectedClient
        ? "The client has been successfully updated."
        : "The client has been successfully added.",
    });
    // Force a refresh of the clients list
    window.location.reload();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Icons.AlertTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold">Error Loading Clients</h3>
        <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="offcanvas">
          {/* Sidebar menu items here, e.g., navigation links */}
        </Sidebar>
        <SidebarContent>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold">Clients</h1>
              <div className="flex w-full sm:w-auto gap-2">
                <div className="relative w-full sm:w-64">
                  <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search clients"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleAddNew}>
                  <Icons.PlusIcon className="h-4 w-4 mr-2" />
                  New Client
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAddDummyClient}
                  disabled={isInserting}
                >
                  {isInserting ? (
                    <>
                      <Icons.LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Icons.UserPlusIcon className="h-4 w-4 mr-2" />
                      Add Dummy
                    </>
                  )}
                </Button>
              </div>
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
            ) : filteredClients && filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onEdit={handleEdit}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icons.SearchXIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">No clients found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? "Try adjusting your search query." : "Add your first client to get started."}
                </p>
              </div>
            )}

            {/* Client Profile Modal */}
            <ClientProfileModal
              client={selectedClient}
              open={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
            />

            {/* Client Form Modal */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedClient ? "Edit Client" : "Add New Client"}
                  </DialogTitle>
                </DialogHeader>
                <ClientForm
                  client={selectedClient ?? undefined}
                  onSuccess={handleFormSuccess}
                  trainerId={1} // Using default trainer ID
                />
              </DialogContent>
            </Dialog>
          </div>
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};

export default Clients;
