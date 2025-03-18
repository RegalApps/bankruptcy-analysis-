
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export interface TemplateEditorProps {
  templates: EmailTemplate[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  onSave: (template: EmailTemplate) => void;
  onDelete: (templateId: string) => void;
  onCreateNew: () => void;
}
