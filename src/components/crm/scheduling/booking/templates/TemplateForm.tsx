
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { EmailTemplate } from "./types";

interface TemplateFormProps {
  template: EmailTemplate;
  onChange: (field: keyof EmailTemplate, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const TemplateForm = ({ 
  template, 
  onChange, 
  onSave, 
  onDelete 
}: TemplateFormProps) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <Input 
          placeholder="Template Name" 
          value={template.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="font-medium"
        />
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Subject Line</label>
          <Input 
            placeholder="Email Subject" 
            value={template.subject}
            onChange={(e) => onChange("subject", e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Email Content</label>
          <Textarea 
            placeholder="Enter email content here..." 
            rows={15}
            value={template.content}
            onChange={(e) => onChange("content", e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Template
          </Button>
          
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
