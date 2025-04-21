import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRound, Building, Calendar, Hash, FileText } from "lucide-react";

interface DocumentClientInfoProps {
  clientInfo: Record<string, any>;
}

export const DocumentClientInfo = ({ clientInfo }: DocumentClientInfoProps) => {
  if (!clientInfo || Object.keys(clientInfo).length === 0) {
    return null;
  }

  // Extract common fields for display
  const {
    clientName,
    name,
    type,
    formType,
    formNumber,
    administratorName,
    filingDate,
    submissionDeadline,
    documentStatus,
    summary,
    ...otherFields
  } = clientInfo;

  const displayName = clientName || name || otherFields.client_name || '';
  const displayType = type || formType || '';
  const displayFormNumber = formNumber || '';
  
  // Check if we have any meaningful data to display
  if (!displayName && !displayType && !displayFormNumber && 
      !administratorName && !filingDate && !submissionDeadline &&
      Object.keys(otherFields).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Client Name */}
          {displayName && (
            <div className="flex items-start gap-2">
              <UserRound className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Client Name</div>
                <div className="font-medium">{displayName}</div>
              </div>
            </div>
          )}
          
          {/* Form Type */}
          {displayType && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Document Type</div>
                <div className="font-medium">{displayType}</div>
              </div>
            </div>
          )}
          
          {/* Form Number */}
          {displayFormNumber && (
            <div className="flex items-start gap-2">
              <Hash className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Form Number</div>
                <div className="font-medium">{displayFormNumber}</div>
              </div>
            </div>
          )}
          
          {/* Administrator Name */}
          {administratorName && (
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Administrator</div>
                <div className="font-medium">{administratorName}</div>
              </div>
            </div>
          )}
          
          {/* Filing Date */}
          {filingDate && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Filing Date</div>
                <div className="font-medium">{filingDate}</div>
              </div>
            </div>
          )}
          
          {/* Submission Deadline */}
          {submissionDeadline && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Submission Deadline</div>
                <div className="font-medium">{submissionDeadline}</div>
              </div>
            </div>
          )}
          
          {/* Document Status */}
          {documentStatus && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div>
                  <Badge variant="outline" className="font-normal">
                    {documentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {/* Other important fields */}
          {Object.entries(otherFields).map(([key, value]) => {
            // Skip non-display fields and empty values
            if (
              key === 'summary' || 
              key === 'type' || 
              key === 'formType' || 
              key === 'formNumber' ||
              key.startsWith('_') ||
              !value
            ) {
              return null;
            }
            
            // Format the key for display
            const formattedKey = key
              .replace(/_/g, ' ')
              .replace(/([A-Z])/g, ' $1')
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            return (
              <div key={key} className="flex items-start gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">{formattedKey}</div>
                  <div className="font-medium">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                     typeof value === 'object' ? JSON.stringify(value) : 
                     String(value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
