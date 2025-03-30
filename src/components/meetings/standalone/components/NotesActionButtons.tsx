
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Printer, Save, Download } from "lucide-react";

interface NotesActionButtonsProps {
  onSave: () => void;
  onCopy: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
  onExportText: () => void;
}

export const NotesActionButtons = ({
  onSave,
  onCopy,
  onPrint,
  onExportPdf,
  onExportText
}: NotesActionButtonsProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        size="sm"
        variant="outline"
        onClick={onCopy}
        className="flex items-center gap-1"
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      
      <Button 
        size="sm"
        variant="outline"
        onClick={onPrint}
        className="flex items-center gap-1"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
      
      <Button 
        size="sm"
        variant="outline"
        onClick={onExportPdf}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        PDF
      </Button>
      
      <Button 
        size="sm"
        variant="outline"
        onClick={onExportText}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        Text
      </Button>
      
      <Button 
        size="sm"
        onClick={onSave}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
    </div>
  );
};
