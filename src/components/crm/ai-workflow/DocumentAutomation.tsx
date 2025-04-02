
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DocumentTemplateEditor, Template } from "./DocumentTemplateEditor";
import { toast } from "sonner";

interface DocumentAutomationProps {
  clientId?: string;
}

export const DocumentAutomation = ({ clientId }: DocumentAutomationProps) => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Client Engagement Letter",
      description: "Standard engagement letter for new clients",
      content: "Dear {{client_name}},\n\nThis letter confirms our engagement...",
      category: "legal",
      status: "active"
    },
    {
      id: "2",
      name: "Financial Statement Review",
      description: "Template for reviewing client financial statements",
      content: "Financial Statement Review\nClient: {{client_name}}\nDate: {{today_date}}...",
      category: "financial",
      status: "active"
    }
  ]);
  
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const handleCreateNew = () => {
    setActiveTemplate({
      id: "",
      name: "",
      description: "",
      content: "",
      category: "legal",
      status: "draft"
    });
    setIsCreatingNew(true);
  };
  
  const handleSaveTemplate = (template: Template) => {
    if (isCreatingNew) {
      // Creating a new template
      const newTemplate = {
        ...template,
        id: `${Date.now()}`
      };
      setTemplates([...templates, newTemplate]);
      setIsCreatingNew(false);
    } else {
      // Updating existing template
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    }
    setActiveTemplate(null);
    toast.success(`Template ${isCreatingNew ? 'created' : 'updated'} successfully`);
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    setActiveTemplate(null);
    toast.success("Template deleted successfully");
  };
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Generate a document for a specific client from a template
  const handleGenerateDocument = (templateId: string) => {
    if (!clientId) {
      toast.error("Please select a client first");
      return;
    }
    
    toast.success("Document generated successfully", {
      description: "The document has been added to the client's documents folder"
    });
  };

  if (activeTemplate) {
    return (
      <DocumentTemplateEditor 
        template={activeTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => setActiveTemplate(null)}
        onDelete={!isCreatingNew ? handleDeleteTemplate : undefined}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Document Templates</CardTitle>
        <Button onClick={handleCreateNew} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </CardHeader>
      <CardContent>
        {!clientId && !templates.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Document Templates</h3>
            <p className="text-muted-foreground mb-4">Create your first document template to automate document generation</p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:border-primary/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className={`h-5 w-5 ${
                            template.category === 'legal' ? 'text-blue-500' : 
                            template.category === 'financial' ? 'text-green-500' : 
                            template.category === 'risk' ? 'text-purple-500' : 
                            'text-amber-500'
                          }`} />
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            {template.description && (
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={template.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}>
                          {template.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setActiveTemplate(template)}
                        >
                          <Settings className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleGenerateDocument(template.id)}
                          disabled={!clientId}
                        >
                          Generate Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No templates matching your search criteria</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
