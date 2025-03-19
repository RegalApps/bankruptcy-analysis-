
import { FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MissingDocumentsSectionProps {
  missingDocuments: number;
}

export const MissingDocumentsSection = ({ missingDocuments }: MissingDocumentsSectionProps) => {
  const getMissingDocumentsDescription = (docs: number) => {
    if (docs === 0) return "All required documents have been received and processed.";
    if (docs < 3) return "A few important documents are still needed to complete the file.";
    if (docs < 5) return "Several key documents have not yet been received, which may delay case processing.";
    return "Many critical documents are missing, which is significantly impacting case progression.";
  };

  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full">
          <FileText className="h-4 w-4 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium">{missingDocuments}</p>
          <p className="text-xs text-muted-foreground">Missing Documents</p>
        </div>
      </div>
      
      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full h-6 text-xs justify-start px-0 text-muted-foreground hover:text-foreground">
            View details
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <p className="text-xs text-muted-foreground">
            {getMissingDocumentsDescription(missingDocuments)}
          </p>
          {missingDocuments > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-1">
                <FileText className="h-3 w-3 mt-0.5 text-red-500" />
                <span className="text-xs">Document collection needed to proceed</span>
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {missingDocuments > 3 ? 'Critical' : 'Important'}
              </Badge>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
