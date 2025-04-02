
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DocumentTemplates } from "./components/templates/DocumentTemplates";
import { FileText, Brain, MessageSquare, PenLine, Sparkles } from "lucide-react";

interface AIWorkflowProps {
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
}

export const AIWorkflow = ({ clientId, clientName, clientEmail }: AIWorkflowProps) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">AI-Powered Workflow Automation</CardTitle>
        <CardDescription>Streamline your client management with intelligent automation</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="templates" className="pt-0">
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
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-1.5 rounded-md">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Client Communication Assistant</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate professional client communications with AI assistance.
                        Draft emails, letters, and messages with context-aware suggestions.
                      </p>
                    </div>
                    <Button className="mt-6 w-full sm:w-auto">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Drafting
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-800/40 p-1.5 rounded-md">
                          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Regulatory Compliance Check</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Verify documents against current regulations automatically.
                        Get instant alerts for potential compliance issues.
                      </p>
                    </div>
                    <Button className="mt-6 w-full sm:w-auto" variant="secondary">
                      <Brain className="mr-2 h-4 w-4" />
                      Run Compliance Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card className="border border-muted">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-muted p-1.5 rounded-md">
                      <PenLine className="h-5 w-5 text-foreground/80" />
                    </div>
                    <h3 className="font-semibold text-lg">Meeting Notes Transcription</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload audio or text from meetings to generate structured notes and action items.
                    AI automatically identifies key points, commitments, and deadlines.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Button className="flex-1">
                      <PenLine className="mr-2 h-4 w-4" />
                      New Transcription
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Previous Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
