
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo/ClientInfoPanel";
import { ClientAgreementTemplate } from "./ClientAgreementTemplate";
import { FinancialReviewTemplate } from "./FinancialReviewTemplate";
import { ClientOnboardingTemplate } from "./ClientOnboardingTemplate";
import { RiskAssessmentTemplate } from "./RiskAssessmentTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, FileUp, Download, Printer, Mail, Search, Check, Clock, Info } from "lucide-react";

interface DocumentTemplatesProps {
  clientId?: string;
  clientName?: string;
}

export const DocumentTemplates = ({ clientId, clientName }: DocumentTemplatesProps) => {
  const [activeTemplate, setActiveTemplate] = useState("agreement");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock client info - in a real app, fetch this from API
  const clientInfo = {
    id: clientId || "1",
    name: clientName || "John Doe",
    email: "client@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    language: "english",
    filing_date: new Date().toISOString(),
    status: "active"
  };
  
  // Mock templates data
  const templates = [
    { id: "agreement", name: "Client Agreement Form", icon: <FileText className="h-4 w-4" />, category: "legal" },
    { id: "financial", name: "Financial Review", icon: <FileText className="h-4 w-4" />, category: "financial" },
    { id: "onboarding", name: "Client Onboarding Checklist", icon: <FileText className="h-4 w-4" />, category: "process" },
    { id: "risk", name: "Risk Assessment", icon: <FileText className="h-4 w-4" />, category: "risk" },
  ];
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderTemplate = () => {
    switch (activeTemplate) {
      case "agreement":
        return <ClientAgreementTemplate clientInfo={clientInfo} />;
      case "financial":
        return <FinancialReviewTemplate clientInfo={clientInfo} />;
      case "onboarding":
        return <ClientOnboardingTemplate clientInfo={clientInfo} />;
      case "risk":
        return <RiskAssessmentTemplate clientInfo={clientInfo} />;
      default:
        return (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Select a template to get started</p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Templates</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Template Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" 
                  onClick={() => setSearchQuery("")}>
                  All Templates
                </Button>
                <Button variant="ghost" className="w-full justify-start" 
                  onClick={() => setSearchQuery("legal")}>
                  Legal Documents
                </Button>
                <Button variant="ghost" className="w-full justify-start" 
                  onClick={() => setSearchQuery("financial")}>
                  Financial Documents
                </Button>
                <Button variant="ghost" className="w-full justify-start" 
                  onClick={() => setSearchQuery("process")}>
                  Process Documents
                </Button>
                <Button variant="ghost" className="w-full justify-start" 
                  onClick={() => setSearchQuery("risk")}>
                  Risk Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Templates</CardTitle>
              <CardDescription>Select a template to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      activeTemplate === template.id ? "bg-primary/10" : "hover:bg-accent/40"
                    }`}
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <span>{template.name}</span>
                    </div>
                    {activeTemplate === template.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No templates found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/40">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Client Agreement - John Doe</p>
                      <p className="text-xs text-muted-foreground">Created 2 days ago</p>
                    </div>
                  </div>
                  <Badge>Signed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/40">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Financial Review - Maria Garcia</p>
                      <p className="text-xs text-muted-foreground">Created 1 week ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">Draft</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/40">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Onboarding - Robert Johnson</p>
                      <p className="text-xs text-muted-foreground">Created 1 month ago</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>{templates.find(t => t.id === activeTemplate)?.name || "Document Template"}</CardTitle>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {clientId ? (
                renderTemplate()
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Please select a client to generate document templates.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
