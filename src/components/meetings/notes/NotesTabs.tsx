
import { useState } from "react";
import { FileText, ListChecks, PenTool } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";

interface NotesTabsProps {
  transcription: string;
  summary: string;
  actionItems: string[];
  isRecording: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NotesTabs = ({
  transcription,
  summary,
  actionItems,
  isRecording,
  activeTab,
  setActiveTab
}: NotesTabsProps) => {
  return (
    <Tabs defaultValue="transcription" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="transcription" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Transcription</span>
        </TabsTrigger>
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <PenTool className="h-4 w-4" />
          <span>Summary</span>
        </TabsTrigger>
        <TabsTrigger value="action-items" className="flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          <span>Action Items</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="transcription" className="border-none p-0">
        <CardContent className="pt-4">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-2 whitespace-pre-wrap font-mono text-sm">
              {transcription || "Waiting for speech..."}
              {isRecording && <span className="animate-pulse">▋</span>}
            </div>
          </ScrollArea>
        </CardContent>
      </TabsContent>
      
      <TabsContent value="summary" className="border-none p-0">
        <CardContent className="pt-4">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {summary ? (
              <div className="space-y-4">
                <p>{summary}</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {isRecording ? 
                  "Summary will be generated when recording stops" : 
                  "Record a meeting to generate a summary"}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </TabsContent>
      
      <TabsContent value="action-items" className="border-none p-0">
        <CardContent className="pt-4">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {actionItems.length > 0 ? (
              <ul className="space-y-2">
                {actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 h-5 w-5 rounded-full border flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {isRecording ? 
                  "Action items will be identified when recording stops" : 
                  "Record a meeting to generate action items"}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </TabsContent>
    </Tabs>
  );
};
