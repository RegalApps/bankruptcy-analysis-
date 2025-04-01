
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  company: string;
  status: string;
  lastActivity: string;
  riskScore: number;
}

interface ClientGridViewProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  searchQuery: string;
  filterStatus: string;
  onExitGridView: () => void; // New prop for exiting grid view
}

export const ClientGridView = ({ 
  clients, 
  onSelectClient,
  searchQuery,
  filterStatus,
  onExitGridView
}: ClientGridViewProps) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "at_risk":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">At Risk</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskIndicator = (score: number) => {
    if (score < 40) {
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-red-500">{score}%</span>
        </div>
      );
    } else if (score < 70) {
      return (
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-amber-500">{score}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-500">{score}%</span>
        </div>
      );
    }
  };

  const toggleSelectClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
  };

  // Filter clients based on search query and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchQuery === "" || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort clients based on sort field and direction
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === "company") {
      return sortDirection === "asc"
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    } else if (sortField === "lastActivity") {
      return sortDirection === "asc"
        ? new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()
        : new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    } else if (sortField === "riskScore") {
      return sortDirection === "asc"
        ? a.riskScore - b.riskScore
        : b.riskScore - a.riskScore;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onExitGridView}
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Client Profile
        </Button>
        
        {selectedClients.length > 0 && (
          <div className="bg-muted p-2 rounded-md flex items-center justify-between">
            <span className="text-sm">{selectedClients.length} clients selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Assign</Button>
              <Button size="sm" variant="outline">Email</Button>
              <Button size="sm" variant="outline">Add Tags</Button>
              <Button size="sm" variant="outline" 
                onClick={() => setSelectedClients([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("company")}>
                <div className="flex items-center">
                  Company
                  {getSortIcon("company")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("lastActivity")}>
                <div className="flex items-center">
                  Last Activity
                  {getSortIcon("lastActivity")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("riskScore")}>
                <div className="flex items-center">
                  Risk Score
                  {getSortIcon("riskScore")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.length > 0 ? (
              sortedClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectClient(client.id)}
                >
                  <TableCell className="w-[50px]" onClick={(e) => { 
                    e.stopPropagation();
                    toggleSelectClient(client.id);
                  }}>
                    <Checkbox 
                      checked={selectedClients.includes(client.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(client.lastActivity), { addSuffix: true })}
                  </TableCell>
                  <TableCell>{getRiskIndicator(client.riskScore)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClient(client.id);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
