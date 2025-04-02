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

export const AIWorkflow = () => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState([
    { id: "1", name: "Client Agreement", category: "legal", status: "active" },
    { id: "2", name: "Financial Review", category: "financial", status: "active" },
    { id: "3", name: "Risk Assessment", category: "risk", status: "active" },
    { id: "4", name: "Client Onboarding", category: "process", status: "active" },
  ]);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    content: "",
    category: "legal"
  });

  const handleTemplateCreate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error("Please provide a name and content for the template");
      return;
    }
    
    const template = {
      id: `${templates.length + 1}`,
      name: newTemplate.name,
      description: newTemplate.description,
      content: newTemplate.content,
      category: newTemplate.category,
      status: "active"
    };
    
    setTemplates([...templates, template]);
    setNewTemplate({ name: "", description: "", content: "", category: "legal" });
    setIsTemplateDialogOpen(false);
    toast.success("Template created successfully");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast.success("Template deleted");
  };

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
        <Tabs defaultValue="assistant" className="space-y-4">
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
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Document Templates</h3>
              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create Document Template</DialogTitle>
                    <DialogDescription>
                      Create a new document template that can be reused across clients and matters.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template Name</label>
                      <Input 
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={newTemplate.category}
                        onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                      >
                        <option value="legal">Legal Document</option>
                        <option value="financial">Financial Document</option>
                        <option value="process">Process Document</option>
                        <option value="risk">Risk Assessment</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input 
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template Content</label>
                      <Textarea 
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                        placeholder="Enter template content here. Use {{variable}} for dynamic fields."
                        rows={8}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleTemplateCreate}>Create Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className={`h-5 w-5 ${
                        template.category === 'legal' ? 'text-blue-500' : 
                        template.category === 'financial' ? 'text-green-500' : 
                        template.category === 'risk' ? 'text-purple-500' : 
                        'text-amber-500'
                      }`} />
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button size="sm" variant="ghost">Use</Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {template.description || "Standard template with customizable terms"}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge className={`${
                      template.status === 'active' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 
                      'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                    }`}>
                      {template.status === 'active' ? 'Active' : 'Draft'}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Category: {template.category}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg border mt-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BrainCog className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">AI Template Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Let AI generate document templates based on your requirements and industry best practices.
                  </p>
                  <Button size="sm" className="mt-2">
                    Generate with AI
                  </Button>
                </div>
              </div>
            </div>
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
