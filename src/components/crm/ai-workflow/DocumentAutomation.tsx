
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Settings, Search, ArrowRight, Calendar, User, FileCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DocumentTemplateEditor, Template } from "./DocumentTemplateEditor";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentAutomationProps {
  clientId?: string;
}

export const DocumentAutomation = ({ clientId }: DocumentAutomationProps) => {
  // Template states
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Client Agreement Form",
      description: "Standard engagement letter for new clients",
      content: "Dear {{client_name}},\n\nThis letter confirms our engagement for insolvency services. We, {{trustee_name}}, will provide professional services related to your {{insolvency_type}}.\n\nBased on our initial assessment, we will guide you through the process, prepare and file all required documentation, and represent your interests with creditors.\n\nOur fees are regulated by the Bankruptcy and Insolvency Act and will be discussed in detail during our consultation.\n\nSincerely,\n{{trustee_name}}\nLicensed Insolvency Trustee",
      category: "legal",
      status: "active"
    },
    {
      id: "2",
      name: "Financial Review Template",
      description: "Template for reviewing client financial statements",
      content: "Financial Statement Review\nClient: {{client_name}}\nDate: {{today_date}}\n\nIncome:\n- Employment Income: ${{income_employment}}\n- Other Income: ${{income_other}}\nTotal Income: ${{income_total}}\n\nExpenses:\n- Housing: ${{expense_housing}}\n- Utilities: ${{expense_utilities}}\n- Food: ${{expense_food}}\nTotal Expenses: ${{expense_total}}\n\nSurplus Income: ${{surplus_income}}\n\nAssets:\n- Real Estate: ${{asset_realestate}}\n- Vehicles: ${{asset_vehicles}}\n- Investments: ${{asset_investments}}\n\nLiabilities:\n- Credit Cards: ${{debt_creditcards}}\n- Loans: ${{debt_loans}}\n- Total Debt: ${{debt_total}}\n\nNotes:\n{{notes}}",
      category: "financial",
      status: "active"
    },
    {
      id: "3",
      name: "Client Onboarding Checklist",
      description: "Standard checklist for client onboarding process",
      content: "# Client Onboarding Checklist for {{client_name}}\n\nDate: {{today_date}}\n\n## Required Documents:\n- [ ] Government-issued ID\n- [ ] Income verification (pay stubs for last 3 months)\n- [ ] Tax returns for the last 2 years\n- [ ] Credit card statements (last 3 months)\n- [ ] Bank statements (last 3 months)\n- [ ] List of assets and approximate values\n- [ ] List of creditors and amounts owed\n\n## Required Tasks:\n- [ ] Initial consultation completed\n- [ ] Credit counseling session booked\n- [ ] Financial assessment completed\n- [ ] Client agreement signed\n- [ ] File opened with Office of the Superintendent of Bankruptcy\n\n## Follow-up Actions:\n- [ ] Schedule follow-up meeting on {{followup_date}}\n- [ ] Send reminder for missing documents\n- [ ] Set up payment schedule\n\nAssigned to: {{assigned_staff}}",
      category: "process",
      status: "active"
    },
    {
      id: "4",
      name: "Risk Assessment Form",
      description: "Template for assessing client risks",
      content: "# Risk Assessment for {{client_name}}\n\nDate: {{today_date}}\nFile #: {{file_number}}\n\n## Compliance Risk Factors\n\n### Missed Deadlines\n- [ ] Form 65 submission (Due: {{form65_due}})\n- [ ] Monthly income reporting (Due: {{income_reporting_due}})\n- [ ] Counseling sessions (Due: {{counseling_due}})\n\n### Missing Documentation\n- [ ] Income verification\n- [ ] Tax returns\n- [ ] Asset documentation\n\n### Financial Inconsistencies\n- [ ] Housing expenses vs. income ratio\n- [ ] Undisclosed assets\n- [ ] Recent large transactions\n\n### Legal Red Flags\n- [ ] Previous bankruptcy/proposal\n- [ ] Recent asset transfers\n- [ ] Potential preference payments\n\n## Overall Risk Assessment\n\nRisk Score: {{risk_score}}/100\nRisk Level: {{risk_level}}\n\n## Recommendations\n\n{{risk_recommendations}}\n\nAssessed by: {{assessor_name}}",
      category: "risk",
      status: "active"
    }
  ]);
  
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Client information (would normally be fetched from API)
  const [clientInfo, setClientInfo] = useState(clientId ? {
    id: clientId,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main Street, Anytown, ON M5V 2N4",
    metrics: { documentCount: 12, taskCount: 5 }
  } : null);
  
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
  
  const filteredTemplates = templates.filter(template => {
    if (activeTab !== "all" && template.category !== activeTab) {
      return false;
    }
    
    return template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  
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

  // Preview a template with client data filled in
  const handlePreviewTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setActiveTemplate(template);
    }
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Document Templates</h2>
          <p className="text-sm text-muted-foreground">Create, edit, and manage document templates</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <TemplateIcon category={template.category} />
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {template.description && (
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass(template.status)}>
                    {template.status === 'active' ? 'Active' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(template.category)}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {getTemplateSize(template.content)} 
                  </Badge>
                </div>
                
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setActiveTemplate(template)}
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreviewTemplate(template.id)}
                      disabled={!clientId}
                    >
                      <FileText className="h-3.5 w-3.5 mr-2" />
                      Preview
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={() => handleGenerateDocument(template.id)}
                      disabled={!clientId}
                    >
                      <ArrowRight className="h-3.5 w-3.5 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">We couldn't find any templates matching your search.</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>Clear search</Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No templates in this category</h3>
                <p className="text-muted-foreground mb-4">Create your first template to get started.</p>
                <Button onClick={handleCreateNew}>Create Template</Button>
              </>
            )}
          </div>
        </Card>
      )}
      
      {!clientId && templates.length > 0 && (
        <Card className="p-4 bg-amber-50/50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">No client selected</h4>
              <p className="text-sm text-amber-700 mt-1">
                Select a client to generate documents using these templates.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Helper functions
const getStatusBadgeClass = (status: string) => {
  return status === 'active' 
    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
    : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'legal': return 'Legal Document';
    case 'financial': return 'Financial Document';
    case 'process': return 'Process Document';
    case 'risk': return 'Risk Assessment';
    default: return category;
  }
};

const getTemplateSize = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  if (words < 100) return 'Short';
  if (words < 500) return 'Medium';
  return 'Long';
};

const TemplateIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'legal':
      return <FileCheck className="h-5 w-5 text-blue-500" />;
    case 'financial':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'process':
      return <Calendar className="h-5 w-5 text-amber-500" />;
    case 'risk':
      return <AlertTriangle className="h-5 w-5 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};
