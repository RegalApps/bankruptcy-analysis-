
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DocumentTemplates } from "./components/templates/DocumentTemplates";
import { FileText, Brain, MessageSquare, PenLine } from "lucide-react";

interface AIWorkflowProps {
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
}

export const AIWorkflow = ({ clientId, clientName, clientEmail }: AIWorkflowProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Workflow Automation</CardTitle>
        <CardDescription>Streamline your client management with intelligent automation</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="templates" className="p-6 pt-0">
          <TabsList className="mb-4">
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Document Templates
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1">
              <PenLine className="h-4 w-4" />
              Smart Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <DocumentTemplates clientId={clientId} clientName={clientName} clientEmail={clientEmail} />
          </TabsContent>
          
          <TabsContent value="assistant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Client Communication Assistant</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Generate professional client communications with AI assistance.
                    </p>
                  </div>
                  <Button className="mt-4">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Drafting
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Regulatory Compliance Check</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Verify documents against current regulations automatically.
                    </p>
                  </div>
                  <Button className="mt-4">
                    <Brain className="mr-2 h-4 w-4" />
                    Run Compliance Check
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">Meeting Notes Transcription</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload audio or text from meetings to generate structured notes and action items.
                </p>
                <Button className="mt-4">
                  <PenLine className="mr-2 h-4 w-4" />
                  New Transcription
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
