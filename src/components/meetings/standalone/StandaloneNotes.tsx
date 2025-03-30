
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { NotesTextarea } from "./components/NotesTextarea";
import { NotesActionButtons } from "./components/NotesActionButtons";
import { useNotes } from "./hooks/useNotes";

export const StandaloneNotes = () => {
  const {
    notes,
    handleNotesChange,
    handleSaveNotes,
    handleCopyNotes,
    handlePrintNotes,
    handleExportPdf,
    handleExportText
  } = useNotes();
  
  return (
    <div className="p-4 min-h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Meeting Notes
          </CardTitle>
          <NotesActionButtons 
            onSave={handleSaveNotes}
            onCopy={handleCopyNotes}
            onPrint={handlePrintNotes}
            onExportPdf={handleExportPdf}
            onExportText={handleExportText}
          />
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <NotesTextarea 
            notes={notes} 
            onChange={handleNotesChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};
