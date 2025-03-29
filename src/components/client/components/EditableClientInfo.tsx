
import React, { useState } from "react";
import { Client } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface EditableClientInfoProps {
  client: Client;
  onSave: (updatedClient: Client) => void;
}

export const EditableClientInfo = ({ client, onSave }: EditableClientInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client>(client);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedClient({
      ...editedClient,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = (value: string) => {
    setEditedClient({
      ...editedClient,
      status: value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would involve an API call
      // For now, we'll simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave(editedClient);
      setIsEditing(false);
      toast.success("Client information updated successfully");
    } catch (error) {
      toast.error("Failed to save client information");
      console.error("Error saving client info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Client Information</CardTitle>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input 
                id="name"
                name="name"
                value={editedClient.name}
                onChange={handleChange}
                placeholder="Client Name"
                disabled={isSaving}
              />
            ) : (
              <div className="text-sm">{client.name}</div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input 
                id="email"
                name="email"
                value={editedClient.email || ''}
                onChange={handleChange}
                placeholder="Email Address"
                disabled={isSaving}
              />
            ) : (
              <div className="text-sm">{client.email || 'Not provided'}</div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input 
                id="phone"
                name="phone"
                value={editedClient.phone || ''}
                onChange={handleChange}
                placeholder="Phone Number"
                disabled={isSaving}
              />
            ) : (
              <div className="text-sm">{client.phone || 'Not provided'}</div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select 
                value={editedClient.status || 'active'} 
                onValueChange={handleStatusChange}
                disabled={isSaving}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm capitalize">{client.status || 'Active'}</div>
            )}
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
