
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface Ticket {
  id: string;
  title: string;
  status: "open" | "in-progress" | "resolved";
  category: string;
  created: string;
  lastActivity: string;
}

const mockTickets: Ticket[] = [
  {
    id: "T-1234",
    title: "Unable to upload PDF files larger than 10MB",
    status: "open",
    category: "General Support",
    created: "2023-05-10",
    lastActivity: "2023-05-10",
  },
  {
    id: "T-1235",
    title: "AI analysis not recognizing form fields correctly",
    status: "in-progress",
    category: "AI Issues",
    created: "2023-05-08",
    lastActivity: "2023-05-09",
  },
  {
    id: "T-1236",
    title: "Need help with BIA compliance for bankruptcy forms",
    status: "resolved",
    category: "Legal Assistance",
    created: "2023-05-05",
    lastActivity: "2023-05-07",
  },
];

export const SupportTicketsList = () => {
  const [filter, setFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all");
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const filteredTickets = mockTickets.filter(
    (ticket) => filter === "all" || ticket.status === filter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Open</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "open" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("open")}
        >
          Open
        </Button>
        <Button
          variant={filter === "in-progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("in-progress")}
        >
          In Progress
        </Button>
        <Button
          variant={filter === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("resolved")}
        >
          Resolved
        </Button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tickets found.</p>
        </div>
      ) : (
        filteredTickets.map((ticket) => (
          <Card key={ticket.id} className={`cursor-pointer hover:shadow-md transition-shadow ${isDarkMode ? 'hover:bg-accent/5' : 'hover:bg-accent/5'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                    {getStatusBadge(ticket.status)}
                    <Badge variant="outline">{ticket.category}</Badge>
                  </div>
                  <CardTitle className="text-base">{ticket.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Created: {ticket.created}</span>
                <span>Last Activity: {ticket.lastActivity}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
