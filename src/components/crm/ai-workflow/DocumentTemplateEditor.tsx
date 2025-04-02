
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface Template {
  id: string;
  name: string;
  description?: string;
  content: string;
  category: string;
  status: 'active' | 'draft';
}

interface DocumentTemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const DocumentTemplateEditor: React.FC<DocumentTemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  onDelete
}) => {
  const [editedTemplate, setEditedTemplate] = useState<Template>({ ...template });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!editedTemplate.name || !editedTemplate.content) {
      toast.error("Template name and content are required");
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(editedTemplate);
      setIsSaving(false);
      toast.success("Template saved successfully");
    }, 800);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this template?")) {
      onDelete(template.id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
        <CardTitle className="mt-2">{editedTemplate.id ? "Edit Template" : "New Template"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={editedTemplate.name}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
            placeholder="Enter template name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-category">Category</Label>
          <select
            id="template-category"
            className="w-full p-2 border rounded-md"
            value={editedTemplate.category}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, category: e.target.value })}
          >
            <option value="legal">Legal Document</option>
            <option value="financial">Financial Document</option>
            <option value="process">Process Document</option>
            <option value="risk">Risk Assessment</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-description">Description</Label>
          <Input
            id="template-description"
            value={editedTemplate.description || ""}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, description: e.target.value })}
            placeholder="Brief description of the template"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="template-content">Template Content</Label>
            <Badge className="bg-blue-500/10 text-blue-500">Variables Available</Badge>
          </div>
          <div className="bg-muted/30 p-2 rounded-md mb-2 text-xs text-muted-foreground">
            Use {{client_name}}, {{client_address}}, {{matter_number}}, {{today_date}}, etc. for dynamic content.
          </div>
          <Textarea
            id="template-content"
            value={editedTemplate.content}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, content: e.target.value })}
            placeholder="Enter template content here..."
            rows={15}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-status">Status</Label>
          <select
            id="template-status"
            className="w-full p-2 border rounded-md"
            value={editedTemplate.status}
            onChange={(e) => setEditedTemplate({ 
              ...editedTemplate, 
              status: e.target.value as 'active' | 'draft' 
            })}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
