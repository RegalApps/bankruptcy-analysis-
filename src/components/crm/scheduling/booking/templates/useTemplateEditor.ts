
import { useState } from "react";
import { toast } from "sonner";
import { EmailTemplate } from "./types";
import { DEFAULT_TEMPLATES } from "./defaultTemplates";

export const useTemplateEditor = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0].id);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate>({...templates[0]});
  
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

  // Handle updating template fields
  const handleUpdateTemplate = (field: keyof EmailTemplate, value: string) => {
    setEditingTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return {
    templates,
    selectedTemplateId,
    editingTemplate,
    handleSelectTemplate,
    handleSaveTemplate,
    handleCreateTemplate,
    handleDeleteTemplate,
    handleUpdateTemplate
  };
};
