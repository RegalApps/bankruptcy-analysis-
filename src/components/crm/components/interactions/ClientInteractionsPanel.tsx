
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone, Calendar, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Interaction {
  date: string;
  type: string;
  description: string;
}

interface ClientInteractionsPanelProps {
  clientId: string;
  interactions: Interaction[];
}

export const ClientInteractionsPanel = ({ clientId, interactions }: ClientInteractionsPanelProps) => {
  const [newInteractionType, setNewInteractionType] = useState<string>("email");
  const [newInteractionDescription, setNewInteractionDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddInteraction = async () => {
    if (!newInteractionDescription.trim()) {
      toast.error("Please enter an interaction description");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to save the interaction
      console.log("Adding interaction:", {
        clientId,
        type: newInteractionType,
        description: newInteractionDescription,
        date: new Date().toISOString()
      });
      
      toast.success("Interaction added successfully");
      
      // Reset form
      setNewInteractionDescription("");
      
      // In a real app, you would refresh the interactions list after adding a new one
    } catch (error) {
      console.error("Error adding interaction:", error);
      toast.error("Failed to add interaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <UserPlus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Interaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="interaction-type">
                Interaction Type
              </label>
              <Select value={newInteractionType} onValueChange={setNewInteractionType}>
                <SelectTrigger id="interaction-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium" htmlFor="interaction-description">
                Description
              </label>
              <Textarea
                id="interaction-description"
                placeholder="Enter interaction details..."
                value={newInteractionDescription}
                onChange={(e) => setNewInteractionDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleAddInteraction}
              disabled={isSubmitting || !newInteractionDescription.trim()}
              className="w-full"
            >
              {isSubmitting ? "Adding..." : "Add Interaction"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interactions.length > 0 ? (
              interactions.map((interaction, index) => (
                <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <div className="mt-1">
                    {getInteractionIcon(interaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium capitalize">{interaction.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(interaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm mt-1">{interaction.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No interactions recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
