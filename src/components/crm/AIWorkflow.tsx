
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BrainCog, MessageSquare, Bot, FileText, GanttChart, Plus, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DocumentAutomation } from "./ai-workflow/DocumentAutomation";

export const AIWorkflow = () => {
  const [activeTab, setActiveTab] = useState("assistant");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCog className="h-5 w-5 text-primary" />
          AI-Powered Workflow Automation
        </CardTitle>
        <CardDescription>
          Leverage AI to automate repetitive tasks and enhance client interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="templates">Document Templates</TabsTrigger>
            <TabsTrigger value="automations">Workflow Automations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant" className="space-y-4">
            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our AI assistant to help with client queries, document analysis, and more.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Analyze Document
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Recent AI Conversations</h3>
              <div className="space-y-2">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="font-medium text-sm">Client Payment Schedule</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 3:45 PM</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="font-medium text-sm">Document Analysis: Financial Statement</p>
                  <p className="text-xs text-muted-foreground">June 12, 2023</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <DocumentAutomation />
          </TabsContent>
          
          <TabsContent value="automations" className="space-y-4">
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <GanttChart className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Workflow Automations</h3>
                  <p className="text-sm text-muted-foreground">
                    Create automated workflows to handle repetitive tasks and client follow-ups.
                  </p>
                  <div className="mt-4">
                    <Button>
                      Create New Workflow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Active Workflows</h3>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Client Onboarding</h4>
                    <p className="text-sm text-muted-foreground">Automatically sends welcome emails and document requests</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-sm text-muted-foreground">Sends timely payment reminders based on due dates</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
