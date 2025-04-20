
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Clock, ArrowDownToLine, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AuditTrailHeaderProps {
  onClientChange: (clientId: number) => void;
}

export const AuditTrailHeader = ({ onClientChange }: AuditTrailHeaderProps) => {
  const clients = [
    { id: 1, name: "John Doe - #CASE12345" },
    { id: 2, name: "Sarah Johnson - #CASE45678" },
    { id: 3, name: "Michael Brown - #CASE98765" }
  ];
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground">
            Complete chronological record of all system events
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Clock className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="default" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Send to Compliance Officer
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Client Selection Dropdown */}
        <Select onValueChange={(value) => onClientChange(Number(value))} defaultValue="1">
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select Client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search audit entries..." className="pl-10" />
        </div>
        
        {/* Export Button - Mobile Only */}
        <Button variant="outline" size="icon" className="md:hidden">
          <ArrowDownToLine className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
