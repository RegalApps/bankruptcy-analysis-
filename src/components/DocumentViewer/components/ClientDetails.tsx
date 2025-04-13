
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, Phone, MapPin, Info, FileText, DollarSign, Clock } from "lucide-react";
import { ExtractedInfo } from "@/utils/documents/types/analysisTypes";

interface ClientDetailsProps {
  extractedInfo: ExtractedInfo;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ extractedInfo }) => {
  // Determine the document type to show relevant fields
  const isForm31 = extractedInfo.formNumber === '31' || 
                   extractedInfo.formType?.toLowerCase().includes('claim');
  const isForm47 = extractedInfo.formNumber === '47' || 
                  extractedInfo.formType?.toLowerCase().includes('consumer proposal');
  const isForm76 = extractedInfo.formNumber === '76' ||
                  extractedInfo.formType?.toLowerCase().includes('bankruptcy');

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <User className="h-4 w-4 mr-2" />
          {isForm31 ? 'Creditor' : 'Client'} Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {/* Client/Creditor Name */}
            <div className="flex items-start">
              <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {isForm31 ? 'Creditor Name' : 'Client Name'}:
                </p>
                <p className="text-sm font-medium">
                  {isForm31 ? extractedInfo.creditorName || extractedInfo.clientName : extractedInfo.clientName}
                </p>
              </div>
            </div>
            
            {/* Address */}
            {(extractedInfo.creditorMailingAddress || extractedInfo.debtorCity) && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isForm31 ? 'Address' : 'Location'}:
                  </p>
                  <p className="text-sm">
                    {isForm31 
                      ? extractedInfo.creditorMailingAddress || `${extractedInfo.debtorCity || ''}, ${extractedInfo.debtorProvince || ''}`
                      : `${extractedInfo.debtorCity || ''} ${extractedInfo.debtorProvince || ''}`
                    }
                  </p>
                </div>
              </div>
            )}
            
            {/* Contact Information */}
            {(extractedInfo.contactPersonName || extractedInfo.contactTelephone) && (
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Contact:</p>
                  <p className="text-sm">{extractedInfo.contactPersonName}</p>
                  {extractedInfo.contactTelephone && (
                    <p className="text-sm">{extractedInfo.contactTelephone}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {/* Document Type */}
            <div className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Document Type:</p>
                <p className="text-sm">
                  {extractedInfo.formType || `Form ${extractedInfo.formNumber || ''}`}
                </p>
              </div>
            </div>
            
            {/* Claim Amount (Form 31) */}
            {isForm31 && extractedInfo.debtAmount && (
              <div className="flex items-start">
                <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Claim Amount:</p>
                  <p className="text-sm">{extractedInfo.debtAmount}</p>
                </div>
              </div>
            )}
            
            {/* Date Information */}
            {(extractedInfo.dateSigned || extractedInfo.executionDate || extractedInfo.filingDate) && (
              <div className="flex items-start">
                <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isForm31 ? 'Execution Date' : 'Filing Date'}:
                  </p>
                  <p className="text-sm">
                    {isForm31 
                      ? extractedInfo.executionDate || extractedInfo.dateSigned
                      : extractedInfo.filingDate || extractedInfo.dateSigned
                    }
                  </p>
                </div>
              </div>
            )}
            
            {/* Status */}
            {extractedInfo.documentStatus && (
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Status:</p>
                  <p className="text-sm">{extractedInfo.documentStatus}</p>
                </div>
              </div>
            )}
            
            {/* Deadline */}
            {extractedInfo.submissionDeadline && (
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Submission Deadline:</p>
                  <p className="text-sm">{extractedInfo.submissionDeadline}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
