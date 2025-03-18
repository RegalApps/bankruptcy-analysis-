
import React from "react";
import { EmailTemplate } from "./types";

interface TemplateListProps {
  templates: EmailTemplate[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateList = ({ 
  templates, 
  selectedTemplateId, 
  onTemplateSelect 
}: TemplateListProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">Available Templates</div>
      <div className="space-y-2">
        {templates.map(template => (
          <div 
            key={template.id}
            className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
              template.id === selectedTemplateId ? 'border-primary bg-muted/50' : ''
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-muted-foreground truncate mt-1">
              {template.subject}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
