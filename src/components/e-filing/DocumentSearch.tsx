
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSearch, Folder, File } from "lucide-react";
import { useState } from "react";
import { Document } from "@/components/DocumentList/types";

interface DocumentSearchProps {
  onDocumentSelect: (document: Document) => void;
}

export const DocumentSearch = ({ onDocumentSelect }: DocumentSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search documents by name, folder, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <ScrollArea className="h-[400px] border rounded-lg">
        <div className="p-4 space-y-4">
          {/* Placeholder folder structure - will be replaced with real data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 hover:bg-accent/10 rounded-md cursor-pointer">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span>Bankruptcy Forms</span>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2 p-2 hover:bg-accent/10 rounded-md cursor-pointer">
                <File className="h-4 w-4 text-muted-foreground" />
                <span>Form 65 - Assignment</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
