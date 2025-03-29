
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save, Copy } from "lucide-react";

export const StandaloneNotes = () => {
  const [notes, setNotes] = React.useState<string>("");
  const { toast } = useToast();
  
  // Load any saved notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem("meeting-notes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    // Auto-save to localStorage as user types
    localStorage.setItem("meeting-notes", e.target.value);
  };
  
  const handleSaveNotes = () => {
    localStorage.setItem("meeting-notes", notes);
    toast({
      title: "Notes saved",
      description: "Your meeting notes have been saved successfully",
    });
  };
  
  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notes);
    toast({
      title: "Copied to clipboard",
      description: "Meeting notes copied to clipboard successfully",
    });
  };
  
  return (
    <div className="p-4 min-h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Meeting Notes
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={handleCopyNotes}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveNotes}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Type your meeting notes here..."
            className="h-full min-h-[calc(100vh-120px)] resize-none rounded-t-none border-x-0 border-b-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};
