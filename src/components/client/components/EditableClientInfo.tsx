
import { useState } from "react";
import { Client } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X } from "lucide-react";

interface EditableClientInfoProps {
  client: Client;
  onSave: (client: Client) => void;
}

export const EditableClientInfo = ({ client, onSave }: EditableClientInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client>(client);
  
  const handleSave = () => {
    onSave(editedClient);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };
  
  const handleChange = (field: keyof Client, value: string) => {
    setEditedClient(prev => {
      if (field === 'status') {
        // Ensure status is one of the allowed values
        const status = value as 'active' | 'inactive' | 'pending';
        return { ...prev, status };
      }
      return { ...prev, [field]: value };
    });
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Client Information</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          {isEditing ? (
            <Input 
              value={editedClient.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          ) : (
            <p>{client.name}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          {isEditing ? (
            <Input 
              value={editedClient.email || ''} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          ) : (
            <p>{client.email || 'Not provided'}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Phone</label>
          {isEditing ? (
            <Input 
              value={editedClient.phone || ''} 
              onChange={(e) => handleChange('phone', e.target.value)} 
            />
          ) : (
            <p>{client.phone || 'Not provided'}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          {isEditing ? (
            <Select 
              value={editedClient.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="capitalize">{client.status}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
