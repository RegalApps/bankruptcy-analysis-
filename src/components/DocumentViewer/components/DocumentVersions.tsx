
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { Check, Clock, History, RotateCcw, User } from "lucide-react";

interface DocumentVersionsProps {
  documentId: string;
}

export const DocumentVersions: React.FC<DocumentVersionsProps> = ({ documentId }) => {
  // Placeholder versions data
  const versions = [
    {
      id: "version-1",
      version_number: 1,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "John Doe",
      is_current: true,
      changes_description: "Initial document upload"
    },
    {
      id: "version-2",
      version_number: 2,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "Jane Smith",
      is_current: false,
      changes_description: "Updated client information and payment details"
    },
    {
      id: "version-3",
      version_number: 3,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "Mike Johnson",
      is_current: false,
      changes_description: "Fixed errors in section 3, added missing signatures"
    }
  ];

  const formatDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Document Versions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          History of document changes and updates
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {versions.map((version, index) => (
            <Card key={version.id} className="p-3">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-2 ${version.is_current ? 'bg-green-100' : 'bg-muted'}`}>
                  {version.is_current ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <History className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">Version {version.version_number}</h4>
                      {version.is_current && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Current
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(version.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm mt-1">{version.changes_description}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {version.created_by}
                    </span>
                    
                    {!version.is_current && (
                      <Button size="sm" variant="outline" className="h-8">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
