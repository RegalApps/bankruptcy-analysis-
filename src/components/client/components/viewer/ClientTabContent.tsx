
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, Document } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AlertCircle, User, Phone, Mail, MapPin, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ClientTabContentProps {
  client: Client;
  documents: Document[];
  lastActivityDate?: string;
}

export const ClientTabContent = ({ client, documents, lastActivityDate }: ClientTabContentProps) => {
  const [notesEditMode, setNotesEditMode] = useState(false);
  const [clientNotes, setClientNotes] = useState(client.notes || '');
  
  const handleSaveNotes = () => {
    // In a real app, you would save the notes to the database here
    setNotesEditMode(false);
    // Show a success toast or message
  };
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Client Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                <p>{client.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <Badge 
                  variant={client.status === 'active' ? "default" : "secondary"}
                >
                  {client.status === 'active' ? 'Active Client' : 'Inactive Client'}
                </Badge>
              </div>
              
              {client.email && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Email
                  </h4>
                  <p>{client.email}</p>
                </div>
              )}
              
              {client.phone && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    Phone
                  </h4>
                  <p>{client.phone}</p>
                </div>
              )}
              
              {client.address && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    Address
                  </h4>
                  <p>{client.address}</p>
                </div>
              )}
              
              {lastActivityDate && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Last Activity
                  </h4>
                  <p>{format(new Date(lastActivityDate), 'MMM d, yyyy')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Client Notes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Notes</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setNotesEditMode(!notesEditMode)}
            >
              <Edit className="h-4 w-4 mr-1" />
              {notesEditMode ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent>
            {notesEditMode ? (
              <div className="space-y-2">
                <Textarea 
                  value={clientNotes} 
                  onChange={e => setClientNotes(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Add notes about this client..."
                />
                <Button onClick={handleSaveNotes}>Save Notes</Button>
              </div>
            ) : (
              <div>
                {client.notes ? (
                  <p className="whitespace-pre-wrap">{client.notes}</p>
                ) : (
                  <p className="text-muted-foreground italic">No notes for this client yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Document Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-md">
                <h4 className="text-xl font-bold">{documents.length}</h4>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
              
              <div className="bg-amber-500/10 p-4 rounded-md">
                <h4 className="text-xl font-bold">
                  {documents.filter(doc => doc.status === 'pending').length}
                </h4>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
              
              <div className="bg-green-500/10 p-4 rounded-md">
                <h4 className="text-xl font-bold">
                  {documents.filter(doc => doc.status === 'approved').length}
                </h4>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents
                  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                  .slice(0, 5)
                  .map(doc => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <div className="p-2 bg-muted rounded-full">
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
