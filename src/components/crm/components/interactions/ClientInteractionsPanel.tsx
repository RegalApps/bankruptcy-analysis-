
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, MessageSquare, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Interaction {
  id: string;
  type: string;
  date: string;
  description: string;
  status?: string;
}

interface ClientInteractionsPanelProps {
  clientId?: string;
}

export const ClientInteractionsPanel = ({ clientId }: ClientInteractionsPanelProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data for interactions
  const interactions: Interaction[] = [
    {
      id: "int-1",
      type: "call",
      date: "2025-03-25T14:30:00",
      description: "Follow-up call about pending documents",
      status: "completed"
    },
    {
      id: "int-2",
      type: "email",
      date: "2025-03-22T10:15:00",
      description: "Sent intake forms and welcome package",
      status: "completed"
    },
    {
      id: "int-3",
      type: "meeting",
      date: "2025-03-18T09:00:00",
      description: "Initial consultation to discuss options",
      status: "completed"
    },
    {
      id: "int-4",
      type: "text",
      date: "2025-03-15T16:45:00",
      description: "Text reminder about upcoming appointment",
      status: "completed"
    }
  ];

  const getInteractionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "call":
        return <Phone className="h-4 w-4 text-blue-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-green-500" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "text":
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Client Interactions</CardTitle>
        <Button size="sm" variant="outline" className="h-8">
          <Plus className="mr-1 h-4 w-4" />
          New Interaction
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="flex items-start space-x-3 border-b pb-3">
                <div className="mt-1 p-2 bg-muted rounded-full">
                  {getInteractionIcon(interaction.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">{interaction.type}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(interaction.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{interaction.description}</p>
                  {interaction.status && (
                    <Badge variant="outline" className="mt-2 capitalize">
                      {interaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {interactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                <h4 className="mt-4 text-lg font-medium">No interactions yet</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Record your first interaction with this client to keep track of your communications.
                </p>
                <Button className="mt-4">
                  <Plus className="mr-1 h-4 w-4" />
                  Add First Interaction
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calls" className="mt-4">
            {interactions.filter(i => i.type.toLowerCase() === 'call').map((interaction) => (
              // Similar structure as above, filtered for calls
              <div key={interaction.id} className="flex items-start space-x-3 border-b pb-3 mb-3">
                <div className="mt-1 p-2 bg-muted rounded-full">
                  <Phone className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Call</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(interaction.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{interaction.description}</p>
                  {interaction.status && (
                    <Badge variant="outline" className="mt-2 capitalize">
                      {interaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="emails" className="mt-4">
            {interactions.filter(i => i.type.toLowerCase() === 'email').map((interaction) => (
              // Similar structure for emails
              <div key={interaction.id} className="flex items-start space-x-3 border-b pb-3 mb-3">
                <div className="mt-1 p-2 bg-muted rounded-full">
                  <Mail className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Email</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(interaction.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{interaction.description}</p>
                  {interaction.status && (
                    <Badge variant="outline" className="mt-2 capitalize">
                      {interaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="meetings" className="mt-4">
            {interactions.filter(i => i.type.toLowerCase() === 'meeting').map((interaction) => (
              // Similar structure for meetings
              <div key={interaction.id} className="flex items-start space-x-3 border-b pb-3 mb-3">
                <div className="mt-1 p-2 bg-muted rounded-full">
                  <Calendar className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Meeting</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(interaction.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{interaction.description}</p>
                  {interaction.status && (
                    <Badge variant="outline" className="mt-2 capitalize">
                      {interaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
