
import React from "react";
import { TemplateEditorHeader } from "./templates/TemplateEditorHeader";
import { TemplateList } from "./templates/TemplateList";
import { TemplateVariables } from "./templates/TemplateVariables";
import { TemplateForm } from "./templates/TemplateForm";
import { useTemplateEditor } from "./templates/useTemplateEditor";

export const BookingTemplateEditor = () => {
  const {
    templates,
    selectedTemplateId,
    editingTemplate,
    handleSelectTemplate,
    handleSaveTemplate,
    handleCreateTemplate,
    handleDeleteTemplate,
    handleUpdateTemplate
  } = useTemplateEditor();
  
  return (
    <div className="space-y-4">
      <TemplateEditorHeader onCreateTemplate={handleCreateTemplate} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <TemplateList 
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={handleSelectTemplate}
          />
          
          <TemplateVariables />
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <TemplateForm 
            template={editingTemplate}
            onChange={handleUpdateTemplate}
            onSave={handleSaveTemplate}
            onDelete={handleDeleteTemplate}
          />
        </div>
      </div>
    </div>
  );
};
