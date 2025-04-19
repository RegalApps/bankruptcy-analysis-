
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowDownToLine, Calendar, FileText, Info, User } from "lucide-react";
import { DocumentDetails } from "../types";
import { formatDistanceToNow } from "date-fns";

interface DocumentMetadataProps {
  document: DocumentDetails | null;
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No document information available</p>
      </div>
    );
  }

  // Extract metadata from document
  const extractedInfo = document.analysis?.[0]?.content?.extracted_info || {};
  const documentType = document.type || extractedInfo.formType || "Unknown";
  
  const metadataItems = [
    { label: "Document Type", value: documentType, icon: FileText },
    { label: "Client Name", value: extractedInfo.clientName, icon: User },
    { label: "Date Signed", value: extractedInfo.dateSigned, icon: Calendar },
    { label: "Form Number", value: extractedInfo.formNumber, icon: Info },
    { label: "Trustee Name", value: extractedInfo.trusteeName, icon: User },
    { label: "Estate Number", value: extractedInfo.estateNumber, icon: Info },
    { label: "Submission Deadline", value: extractedInfo.submissionDeadline, icon: Calendar },
  ];

  // Filter out empty values
  const validMetadataItems = metadataItems.filter(item => item.value);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Document Details</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Information extracted from the document
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Key Details */}
          <Card className="p-4">
            <h4 className="text-sm font-medium mb-3">Key Information</h4>
            
            <div className="space-y-3">
              {validMetadataItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value || "N/A"}</p>
                  </div>
                </div>
              ))}
              
              {validMetadataItems.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No metadata extracted from this document</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Summary Section */}
          {extractedInfo.summary && (
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Document Summary</h4>
              <p className="text-sm">{extractedInfo.summary}</p>
            </Card>
          )}
          
          {/* Deadlines Section */}
          {document.deadlines && document.deadlines.length > 0 && (
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-3">Key Deadlines</h4>
              <div className="space-y-3">
                {document.deadlines.map((deadline, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">{deadline.dueDate}</p>
                      {deadline.description && (
                        <p className="text-xs mt-1">{deadline.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* File Details */}
          <Card className="p-4">
            <h4 className="text-sm font-medium mb-3">File Details</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-2">
                  <ArrowDownToLine className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Upload Date</p>
                  <p className="text-sm">{
                    document.created_at || document.creation_date
                      ? formatDistanceToNow(new Date(document.created_at || document.creation_date), { addSuffix: true })
                      : "Unknown"
                  }</p>
                </div>
              </div>
              
              {(document.size || document.file_size) && (
                <div className="flex items-start gap-3">
                  <div className="bg-muted rounded-full p-2">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">File Size</p>
                    <p className="text-sm">{Math.round((document.size || document.file_size) / 1024)} KB</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
