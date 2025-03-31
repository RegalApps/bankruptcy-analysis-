
import { CardHeader, Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Copy, Printer, FileText, FileDown, User } from "lucide-react";
import { useNotes } from "./hooks/useNotes";
import { NotesHeader } from "../notes/NotesHeader";

export const StandaloneNotes = () => {
  const {
    notes,
    handleNotesChange,
    handleSaveNotes,
    handleCopyNotes,
    handlePrintNotes,
    handleExportPdf,
    handleExportText,
    isSharedMeeting
  } = useNotes();

  return (
    <div className="container p-4 mx-auto max-w-4xl h-screen flex flex-col">
      <Card className="min-h-0 flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <NotesHeader title={isSharedMeeting ? "Shared Meeting Notes" : "Meeting Notes"} isStandalone={true} />
          
          {isSharedMeeting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <User className="h-3.5 w-3.5" />
              <span>You are viewing notes shared with you</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col pb-0">
          <Textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Enter meeting notes here..."
            className="flex-1 min-h-[300px] resize-none"
            readOnly={isSharedMeeting}
          />
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2 pt-4">
          {!isSharedMeeting && (
            <Button onClick={handleSaveNotes} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Notes
            </Button>
          )}
          
          <Button variant="outline" onClick={handleCopyNotes} className="flex items-center gap-1">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          
          <Button variant="outline" onClick={handlePrintNotes} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          
          <Button variant="outline" onClick={handleExportPdf} className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Button variant="outline" onClick={handleExportText} className="flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            Export Text
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
