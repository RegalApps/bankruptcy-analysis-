
import { Shield, Download, Calendar, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Client } from "./types";

// Mock data for demonstration
const mockClients: Client[] = [
  { id: "all", name: "All Clients" },
  { id: "1", name: "Acme Corporation" },
  { id: "2", name: "Globex Industries" },
  { id: "3", name: "Initech LLC" },
  { id: "4", name: "Massive Dynamic" },
  { id: "5", name: "Wayne Enterprises" },
];

export const AuditTrailHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client>(mockClients[0]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    // Here you would filter the audit entries by client
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting audit report...");
    // In a real app, this would trigger a secure PDF export
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">SecureFiles AI Audit Trail</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between md:w-64">
              {selectedClient.name}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-auto">
            {mockClients.map(client => (
              <DropdownMenuItem 
                key={client.id}
                onClick={() => handleClientSelect(client)}
                className={selectedClient.id === client.id ? "bg-muted" : ""}
              >
                {client.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex-1 flex items-center gap-3">
          <DatePickerWithRange />
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> Last 7 days
        </span>
        <span>•</span>
        <span>154 activities</span>
        <span>•</span>
        <span>12 users</span>
        <span>•</span>
        <span>5 critical events</span>
      </div>
    </div>
  );
};
