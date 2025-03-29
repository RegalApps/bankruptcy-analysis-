
import { useState } from "react";
import { Client } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
        return { ...prev, [field]: status };
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Mobile Phone</label>
            {isEditing ? (
              <Input 
                value={editedClient.mobilePhone || ''} 
                onChange={(e) => handleChange('mobilePhone', e.target.value)} 
              />
            ) : (
              <p>{client.mobilePhone || 'Not provided'}</p>
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
        
        <div>
          <label className="text-sm font-medium mb-1 block">Address</label>
          {isEditing ? (
            <Input 
              value={editedClient.address || ''} 
              onChange={(e) => handleChange('address', e.target.value)} 
            />
          ) : (
            <p>{client.address || 'Not provided'}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">City</label>
            {isEditing ? (
              <Input 
                value={editedClient.city || ''} 
                onChange={(e) => handleChange('city', e.target.value)} 
              />
            ) : (
              <p>{client.city || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Province/State</label>
            {isEditing ? (
              <Input 
                value={editedClient.province || ''} 
                onChange={(e) => handleChange('province', e.target.value)} 
              />
            ) : (
              <p>{client.province || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Postal Code</label>
            {isEditing ? (
              <Input 
                value={editedClient.postalCode || ''} 
                onChange={(e) => handleChange('postalCode', e.target.value)} 
              />
            ) : (
              <p>{client.postalCode || 'Not provided'}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Company</label>
            {isEditing ? (
              <Input 
                value={editedClient.company || ''} 
                onChange={(e) => handleChange('company', e.target.value)} 
              />
            ) : (
              <p>{client.company || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Occupation</label>
            {isEditing ? (
              <Input 
                value={editedClient.occupation || ''} 
                onChange={(e) => handleChange('occupation', e.target.value)} 
              />
            ) : (
              <p>{client.occupation || 'Not provided'}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Notes</label>
          {isEditing ? (
            <Textarea 
              value={editedClient.notes || ''} 
              onChange={(e) => handleChange('notes', e.target.value)} 
              className="min-h-[100px]"
            />
          ) : (
            <p className="whitespace-pre-line">{client.notes || 'No notes'}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
