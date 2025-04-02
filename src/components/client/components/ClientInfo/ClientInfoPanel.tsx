
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, User, Phone, Mail, Home, Calendar, CheckCircle2, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { Client, Document, Task } from "../../types";

export interface ClientInfoPanelProps {
  client?: Client;
  clientId?: string;
  clientName?: string;
  clientInfo?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    language?: string;
    filing_date?: string;
    status?: string;
  };
  tasks?: Task[];
  documentCount?: number;
  lastActivityDate?: string;
  documents?: Document[];
  onDocumentSelect?: (documentId: string) => void;
  selectedDocumentId?: string | null;
  readOnly?: boolean;
  onClientUpdate?: (updatedClient: any) => void;
  onUpdate?: (data: any) => void;
}

export const ClientInfoPanel = ({ 
  client,
  clientId,
  clientName,
  clientInfo,
  readOnly = true,
  onUpdate,
  onClientUpdate,
  tasks,
  documentCount,
  lastActivityDate,
  documents,
  onDocumentSelect,
  selectedDocumentId
}: ClientInfoPanelProps) => {
  // Extract client info from client object or use provided clientInfo
  // Handle missing properties in Client type
  const effectiveClientInfo = clientInfo || (client ? {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    // Access these properties safely as they might not exist on Client type
    language: client.metadata?.language || "english",
    filing_date: client.metadata?.filing_date || new Date().toISOString(),
    status: client.status
  } : null);
  
  const effectiveClientName = effectiveClientInfo?.name || clientName || "Client Name";
  
  const [formData, setFormData] = useState({
    name: effectiveClientInfo?.name || effectiveClientName,
    email: effectiveClientInfo?.email || "",
    phone: effectiveClientInfo?.phone || "",
    address: effectiveClientInfo?.address || "",
    language: effectiveClientInfo?.language || "english",
    filing_date: effectiveClientInfo?.filing_date || new Date().toISOString(),
    status: effectiveClientInfo?.status || "active"
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (onUpdate) {
      onUpdate({ ...formData, [name]: value });
    }
    
    if (onClientUpdate && client) {
      // For client object, store language and filing_date in metadata
      if (name === 'language' || name === 'filing_date') {
        onClientUpdate({
          ...client,
          metadata: {
            ...client.metadata,
            [name]: value
          }
        });
      } else {
        onClientUpdate({ ...client, [name]: value });
      }
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (onUpdate) {
      onUpdate({ ...formData, [name]: value });
    }
    
    if (onClientUpdate && client) {
      // For client object, store language and filing_date in metadata
      if (name === 'language' || name === 'filing_date') {
        onClientUpdate({
          ...client,
          metadata: {
            ...client.metadata,
            [name]: value
          }
        });
      } else {
        onClientUpdate({ ...client, [name]: value });
      }
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded text-sm">{formData.name}</div>
              ) : (
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> Email
              </Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded text-sm">{formData.email || "Not provided"}</div>
              ) : (
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded text-sm">{formData.phone || "Not provided"}</div>
              ) : (
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Address
              </Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded text-sm">{formData.address || "Not provided"}</div>
              ) : (
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-1">
                <Languages className="h-4 w-4" /> Preferred Language
              </Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded text-sm capitalize">{formData.language}</div>
              ) : (
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filing_date" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Filing Date
              </Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded text-sm">
                  {formData.filing_date ? formatDate(formData.filing_date) : "Not set"}
                </div>
              ) : (
                <Input 
                  id="filing_date" 
                  name="filing_date" 
                  type="date" 
                  value={formData.filing_date ? formData.filing_date.substring(0, 10) : ""} 
                  onChange={handleInputChange}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Status
              </Label>
              {readOnly ? (
                <div className="p-2 bg-muted/40 rounded">
                  <Badge variant={
                    formData.status === "active" ? "default" : 
                    formData.status === "pending" ? "secondary" : 
                    formData.status === "completed" ? "success" : "outline"
                  }>
                    {formData.status}
                  </Badge>
                </div>
              ) : (
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {!readOnly && (
          <div className="flex justify-end pt-2">
            <Button onClick={() => {
              if (onUpdate) onUpdate(formData);
              if (onClientUpdate && client) {
                // For client updates, handle language and filing_date in metadata
                const updatedClient = { ...client };
                
                // Update normal properties
                updatedClient.name = formData.name;
                updatedClient.email = formData.email;
                updatedClient.phone = formData.phone;
                
                // Ensure metadata exists
                updatedClient.metadata = updatedClient.metadata || {};
                
                // Update metadata properties
                updatedClient.metadata.address = formData.address;
                updatedClient.metadata.language = formData.language;
                updatedClient.metadata.filing_date = formData.filing_date;
                
                // Update status directly
                updatedClient.status = formData.status;
                
                onClientUpdate(updatedClient);
              }
            }}>
              Update Client Information
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
