import { Separator } from "@/components/ui/separator";
import { DocumentDetailsProps } from "../types";
import { Calendar, FileText, User, Building, DollarSign, FileCheck, Info, MapPin, Phone } from "lucide-react";
import { normalizeFormType } from "@/utils/formTypeUtils";

interface ReadOnlyFieldsProps {
  fields: DocumentDetailsProps;
  formType?: string;
  metadata?: Record<string, any>;
}

// Format a field label from camelCase to Title Case with spaces
const formatFieldLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .trim();
};

export const ReadOnlyFields: React.FC<ReadOnlyFieldsProps> = ({ fields, formType, metadata }) => {
  // Safely check form types with null/undefined handling
  const normalized = normalizeFormType(formType);
  const isForm31 = normalized === 'form31';
  const isForm47 = normalized === 'form47';
  
  // Helper function to get an appropriate icon for a field based on its key
  const getIconForField = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      clientName: <User className="h-4 w-4 text-blue-500" />,
      trusteeName: <User className="h-4 w-4 text-blue-500" />,
      administratorName: <User className="h-4 w-4 text-blue-500" />,
      claimantName: <User className="h-4 w-4 text-blue-500" />,
      creditorName: <Building className="h-4 w-4 text-blue-500" />,
      debtorName: <Building className="h-4 w-4 text-blue-500" />,
      dateSigned: <Calendar className="h-4 w-4 text-blue-500" />,
      formNumber: <FileText className="h-4 w-4 text-blue-500" />,
      estateNumber: <FileText className="h-4 w-4 text-blue-500" />,
      claimAmount: <DollarSign className="h-4 w-4 text-blue-500" />,
      claimType: <FileCheck className="h-4 w-4 text-blue-500" />,
      formType: <FileText className="h-4 w-4 text-blue-500" />,
      filingDate: <Calendar className="h-4 w-4 text-blue-500" />,
      documentStatus: <Info className="h-4 w-4 text-blue-500" />,
      creditorAddress: <MapPin className="h-4 w-4 text-blue-500" />,
      debtorAddress: <MapPin className="h-4 w-4 text-blue-500" />,
      bankruptcyDate: <Calendar className="h-4 w-4 text-blue-500" />,
      dateBankruptcy: <Calendar className="h-4 w-4 text-blue-500" />,
      contactInfo: <Phone className="h-4 w-4 text-blue-500" />,
    };
    
    return iconMap[key] || <Info className="h-4 w-4 text-blue-500" />;
  };
  
  // Get icon for metadata field
  const getIconForMetadataField = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      formType: <FileText className="h-4 w-4 text-blue-500" />,
      debtorName: <Building className="h-4 w-4 text-blue-500" />,
      debtorLocation: <MapPin className="h-4 w-4 text-blue-500" />,
      creditorName: <Building className="h-4 w-4 text-blue-500" />,
      creditorRepresentative: <User className="h-4 w-4 text-blue-500" />,
      creditorLocation: <MapPin className="h-4 w-4 text-blue-500" />,
      amountOwed: <DollarSign className="h-4 w-4 text-blue-500" />,
      claimType: <FileCheck className="h-4 w-4 text-blue-500" />,
      priorityClaimed: <Info className="h-4 w-4 text-blue-500" />,
      attachments: <FileText className="h-4 w-4 text-blue-500" />,
      dateOfBankruptcy: <Calendar className="h-4 w-4 text-blue-500" />,
      formSigned: <Calendar className="h-4 w-4 text-blue-500" />,
      relatedPartyDeclaration: <Info className="h-4 w-4 text-blue-500" />,
      dischargeCopyRequest: <Info className="h-4 w-4 text-blue-500" />,
      contactInfo: <Phone className="h-4 w-4 text-blue-500" />,
      // Form 47 specific
      proposalType: <FileText className="h-4 w-4 text-blue-500" />,
      totalDebt: <DollarSign className="h-4 w-4 text-blue-500" />,
      proposedPayment: <DollarSign className="h-4 w-4 text-blue-500" />,
      paymentSchedule: <Calendar className="h-4 w-4 text-blue-500" />,
      securedCreditors: <Building className="h-4 w-4 text-blue-500" />,
      unsecuredCreditors: <Building className="h-4 w-4 text-blue-500" />,
      administratorFees: <DollarSign className="h-4 w-4 text-blue-500" />,
      counselingFees: <DollarSign className="h-4 w-4 text-blue-500" />,
      witnessInfo: <User className="h-4 w-4 text-blue-500" />,
    };
    
    return iconMap[key] || <Info className="h-4 w-4 text-blue-500" />;
  };
  
  // Format metadata key for display
  const formatMetadataKey = (key: string): string => {
    return formatFieldLabel(key);
  };
  
  // Ensure fields is an object before trying to use Object.entries
  const fieldsObj = fields || {};
  const nonEmptyFields = Object.entries(fieldsObj).filter(([key, value]) => {
    return value !== undefined && value !== '' && key !== 'metadata' && key !== 'documentId';
  });
  
  // Safely handle metadata with null checks
  const metadataObj = fields?.metadata || metadata || {};
  const metadataFields = Object.keys(metadataObj).length > 0
    ? Object.entries(metadataObj) 
    : [];
  
  return (
    <div className="space-y-4">
      {/* Main Fields */}
      <div className="grid grid-cols-1 gap-3">
        {nonEmptyFields.map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <div className="mt-0.5">{getIconForField(key)}</div>
            <div>
              <p className="text-sm font-medium text-foreground">{formatFieldLabel(key)}</p>
              <p className="text-sm text-muted-foreground">{String(value)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Metadata Fields for Form 31 */}
      {isForm31 && metadataFields.length > 0 && (
        <>
          <Separator />
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-3">Additional Details</h3>
            <div className="grid grid-cols-1 gap-3">
              {metadataFields.map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <div className="mt-0.5">{getIconForMetadataField(key)}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatMetadataKey(key)}</p>
                    <p className="text-sm text-muted-foreground">{String(value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Metadata Fields for Form 47 */}
      {isForm47 && metadataFields.length > 0 && (
        <>
          <Separator />
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-3">Proposal Details</h3>
            <div className="grid grid-cols-1 gap-3">
              {metadataFields.map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <div className="mt-0.5">{getIconForMetadataField(key)}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatMetadataKey(key)}</p>
                    <p className="text-sm text-muted-foreground">{String(value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
