
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Sample email templates
const DEFAULT_TEMPLATES = [
  {
    id: "template-1",
    name: "Initial Booking Request",
    subject: "Schedule Your Appointment - {{caseType}} Case",
    content: `Dear {{clientName}},

We hope this email finds you well. We're writing to provide you with a personalized booking link that will allow you to schedule your upcoming appointment for your {{caseType}} case.

Please click the link below to access our self-booking portal:
{{bookingLink}}

Based on your case details, our AI system has identified optimal appointment slots with the most suitable trustee for your specific situation. The booking system will guide you through selecting a time that works best for you.

If you have any questions or need assistance with the booking process, please don't hesitate to contact us.

Best regards,
The Trustee Team`
  },
  {
    id: "template-2",
    name: "Appointment Confirmation",
    subject: "Your Appointment is Confirmed - {{caseType}}",
    content: `Dear {{clientName}},

This email confirms your upcoming appointment:

Date: {{appointmentDate}}
Time: {{appointmentTime}}
Trustee: {{trusteeName}}
Location: {{officeAddress}}

Please arrive 10 minutes early and bring the following documents:
- Government-issued photo ID
- Recent pay stubs or income statements
- List of assets and liabilities
- Any relevant court documents

If you need to reschedule, please contact us at least 24 hours in advance.

We look forward to meeting with you.

Best regards,
The Trustee Team`
  }
];

export const BookingTemplateEditor = () => {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [editingTemplate, setEditingTemplate] = useState({...templates[0]});
  
  // Handle selecting a template
  const handleSelectTemplate = (templateId: string) => {
    // Save any current changes
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplateId ? editingTemplate : template
      )
    );
    
    // Load the selected template
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates.find(t => t.id === templateId) || templates[0];
    setEditingTemplate({...selectedTemplate});
  };
  
  // Handle saving template changes
  const handleSaveTemplate = () => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplateId ? editingTemplate : template
      )
    );
    
    toast.success("Template saved successfully");
  };
  
  // Handle creating a new template
  const handleCreateTemplate = () => {
    const newTemplate = {
      id: `template-${templates.length + 1}`,
      name: "New Template",
      subject: "New Email Subject",
      content: "Enter your email content here..."
    };
    
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
    setEditingTemplate(newTemplate);
  };
  
  // Handle deleting a template
  const handleDeleteTemplate = () => {
    if (templates.length <= 1) {
      toast.error("Cannot delete the last template");
      return;
    }
    
    const newTemplates = templates.filter(template => template.id !== selectedTemplateId);
    setTemplates(newTemplates);
    setSelectedTemplateId(newTemplates[0].id);
    setEditingTemplate({...newTemplates[0]});
    
    toast.success("Template deleted");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Email Templates</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-1" /> 
            New Template
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="text-sm text-muted-foreground mb-2">Available Templates</div>
          <div className="space-y-2">
            {templates.map(template => (
              <div 
                key={template.id}
                className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                  template.id === selectedTemplateId ? 'border-primary bg-muted/50' : ''
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground truncate mt-1">
                  {template.subject}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-4">
            <p className="mb-2">Available Variables:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{"{{clientName}}"} - Client's full name</li>
              <li>{"{{bookingLink}}"} - Self-booking portal link</li>
              <li>{"{{caseType}}"} - Type of insolvency case</li>
              <li>{"{{appointmentDate}}"} - Scheduled date</li>
              <li>{"{{appointmentTime}}"} - Scheduled time</li>
              <li>{"{{trusteeName}}"} - Assigned trustee</li>
              <li>{"{{officeAddress}}"} - Office location</li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Input 
                placeholder="Template Name" 
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                className="font-medium"
              />
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Subject Line</label>
                <Input 
                  placeholder="Email Subject" 
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email Content</label>
                <Textarea 
                  placeholder="Enter email content here..." 
                  rows={15}
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleDeleteTemplate} className="text-red-500">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Template
                </Button>
                
                <Button size="sm" onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
