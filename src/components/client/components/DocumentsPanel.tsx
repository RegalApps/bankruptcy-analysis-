
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface DocumentsPanelProps {
  documents: Document[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDocumentOpen: (documentId: string) => void;
}

export const DocumentsPanel = ({ 
  documents, 
  activeTab, 
  setActiveTab, 
  onDocumentOpen 
}: DocumentsPanelProps) => {
  return (
    <div className="p-4 h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-1.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-1.5" />
            Activity History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-0">
          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                <p className="text-muted-foreground">This client doesn't have any documents yet.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <Card 
                  key={doc.id} 
                  className="hover:shadow-sm cursor-pointer transition-shadow"
                  onClick={() => onDocumentOpen(doc.id)}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Last modified: {new Date(doc.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Activity History</h3>
            <p className="text-muted-foreground">
              Activity history feature will be available soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
