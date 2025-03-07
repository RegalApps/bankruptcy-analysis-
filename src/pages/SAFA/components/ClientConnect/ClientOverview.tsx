
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "../../types/client";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ClientCard } from "./components/ClientCard";
import { ClientFilterSection } from "./components/ClientFilterSection";

interface ClientOverviewProps {
  onSelectClient: (client: Client) => void;
}

export const ClientOverview = ({ onSelectClient }: ClientOverviewProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, activeFilter]);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_interaction', { ascending: false });

      if (error) throw error;

      setClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load client list."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.phone && client.phone.includes(searchTerm))
      );
    }
    
    // Apply status filter
    if (activeFilter !== "all") {
      if (activeFilter === "active") {
        filtered = filtered.filter(client => client.status === "active");
      } else if (activeFilter === "inactive") {
        filtered = filtered.filter(client => client.status === "inactive");
      } else if (activeFilter === "high-engagement") {
        filtered = filtered.filter(client => client.engagement_score >= 7);
      }
    }
    
    setFilteredClients(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleAddClient = () => {
    // Placeholder for add client functionality
    toast({
      title: "Coming Soon",
      description: "Add client functionality will be available soon."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <ClientFilterSection 
        onAddClient={handleAddClient}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="space-y-3 p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clients found matching your criteria.</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onSelect={onSelectClient} 
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
