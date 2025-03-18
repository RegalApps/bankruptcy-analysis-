
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TemplateEditorHeaderProps {
  onCreateTemplate: () => void;
}

export const TemplateEditorHeader = ({ onCreateTemplate }: TemplateEditorHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm font-medium">Email Templates</div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onCreateTemplate}>
          <Plus className="h-4 w-4 mr-1" /> 
          New Template
        </Button>
      </div>
    </div>
  );
};
