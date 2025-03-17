
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Search, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Client } from "../../types/client";

interface ClientOverviewProps {
  onSelectClient: (client: Client) => void;
}

export const ClientOverview = ({ onSelectClient }: ClientOverviewProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching clients from the database
        // In a real app, this would fetch from Supabase
        setTimeout(() => {
          const mockClients: Client[] = [
            {
              id: "1",
              name: "John Smith",
              email: "john.smith@example.com",
              phone: "+1 (555) 123-4567",
              status: "active",
              last_interaction: new Date().toISOString(),
              case_type: "consumer_proposal",
              risk_level: "medium"
            },
            {
              id: "2", 
              name: "Jane Doe",
              email: "jane.doe@example.com",
              phone: "+1 (555) 987-6543",
              status: "active",
              last_interaction: new Date(Date.now() - 86400000 * 3).toISOString(),
              case_type: "bankruptcy",
              risk_level: "high"
            },
            {
              id: "3",
              name: "Michael Johnson",
              email: "michael.j@example.com",
              phone: "+1 (555) 456-7890",
              status: "pending",
              last_interaction: new Date(Date.now() - 86400000 * 7).toISOString(),
              case_type: "consumer_proposal",
              risk_level: "low"
            },
            {
              id: "4",
              name: "Sarah Williams",
              email: "sarah.w@example.com",
              phone: "+1 (555) 789-0123",
              status: "inactive",
              last_interaction: new Date(Date.now() - 86400000 * 14).toISOString(),
              case_type: "corporate_insolvency",
              risk_level: "medium"
            }
          ];
          
          setClients(mockClients);
          setFilteredClients(mockClients);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          (client.email && client.email.toLowerCase().includes(query)) ||
          (client.phone && client.phone.includes(query))
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getRiskBadgeColor = (risk: string | undefined) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9 w-[300px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectClient(client)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {client.case_type
                          ? client.case_type.replace("_", " ")
                          : "No case type"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs uppercase font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-700"
                        : client.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {client.status}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last activity: {new Date(client.last_interaction || Date.now()).toLocaleDateString()}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getRiskBadgeColor(client.risk_level)}`}>
                      {client.risk_level || "unknown"} risk
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Brain className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:inline">Connect</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredClients.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium mb-2">No clients found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try a different search term." : "There are no clients to display."}
          </p>
        </div>
      )}
    </div>
  );
};
