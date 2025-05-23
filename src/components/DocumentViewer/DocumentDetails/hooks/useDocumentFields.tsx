
import { useMemo } from 'react';
import { FileText, User, Calendar, Building, DollarSign, Users, FileCog } from "lucide-react";
import { EditableField } from "../../types";

export const useDocumentFields = (
  clientName?: string,
  trusteeName?: string,
  administratorName?: string,
  dateSigned?: string,
  formNumber?: string,
  estateNumber?: string,
  district?: string,
  divisionNumber?: string,
  courtNumber?: string,
  meetingOfCreditors?: string,
  chairInfo?: string,
  securityInfo?: string,
  dateBankruptcy?: string,
  officialReceiver?: string,
  documentStatus?: string,
  filingDate?: string,
  submissionDeadline?: string,
  formType?: string
) => {
  const fields = useMemo<EditableField[]>(() => [
    { 
      label: "Form Number", 
      key: "formNumber", 
      value: formNumber || '', 
      showForTypes: ['all'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Client/Debtor Name", 
      key: "clientName", 
      value: clientName || '', 
      showForTypes: ['all'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Document Status", 
      key: "documentStatus", 
      value: documentStatus || '', 
      showForTypes: ['all', 'form-47', 'proposal', 'form-31'],
      icon: <FileCog className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Licensed Insolvency Trustee", 
      key: "trusteeName", 
      value: trusteeName || '', 
      showForTypes: ['form-76', 'bankruptcy', 'form-31'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Administrator", 
      key: "administratorName", 
      value: administratorName || '', 
      showForTypes: ['form-47', 'proposal'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Filing Date", 
      key: "filingDate", 
      value: filingDate ? new Date(filingDate).toLocaleDateString() : '', 
      showForTypes: ['form-47', 'form-76', 'proposal', 'bankruptcy', 'form-31'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Submission Deadline", 
      key: "submissionDeadline", 
      value: submissionDeadline ? new Date(submissionDeadline).toLocaleDateString() : '', 
      showForTypes: ['form-47', 'form-76', 'proposal', 'bankruptcy', 'form-31'],
      icon: <Calendar className="h-4 w-4 text-blue-500" />
    },
    { 
      label: "Date Signed", 
      key: "dateSigned", 
      value: dateSigned || '', 
      showForTypes: ['all'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Estate Number", 
      key: "estateNumber", 
      value: estateNumber || '', 
      showForTypes: ['bankruptcy', 'proposal', 'form-31'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "District", 
      key: "district", 
      value: district || '', 
      showForTypes: ['bankruptcy', 'proposal', 'form-31'],
      icon: <Building className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Division Number", 
      key: "divisionNumber", 
      value: divisionNumber || '', 
      showForTypes: ['bankruptcy', 'proposal', 'form-31'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Court Number", 
      key: "courtNumber", 
      value: courtNumber || '', 
      showForTypes: ['bankruptcy', 'proposal', 'court', 'form-31'],
      icon: <Building className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Meeting of Creditors", 
      key: "meetingOfCreditors", 
      value: meetingOfCreditors || '', 
      showForTypes: ['bankruptcy', 'proposal', 'meeting', 'form-47', 'form-31'],
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Chair Information", 
      key: "chairInfo", 
      value: chairInfo || '', 
      showForTypes: ['meeting', 'form-47'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Security Information", 
      key: "securityInfo", 
      value: securityInfo || '', 
      showForTypes: ['security', 'form-31'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Date of Bankruptcy", 
      key: "dateBankruptcy", 
      value: dateBankruptcy || '', 
      showForTypes: ['bankruptcy', 'form-31'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Official Receiver", 
      key: "officialReceiver", 
      value: officialReceiver || '', 
      showForTypes: ['bankruptcy', 'proposal', 'form-31'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Payment to Secured Creditors", 
      key: "securedCreditorsPayment", 
      value: "As specified in proposal", 
      showForTypes: ['form-47'],
      icon: <DollarSign className="h-4 w-4 text-green-500" />
    },
    { 
      label: "Payment to Unsecured Creditors", 
      key: "unsecuredCreditorsPayment", 
      value: "As specified in proposal", 
      showForTypes: ['form-47'],
      icon: <DollarSign className="h-4 w-4 text-green-500" />
    },
    // Form 31 specific fields
    { 
      label: "Creditor Name", 
      key: "creditorName", 
      value: clientName || '', 
      showForTypes: ['form-31'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Claim Amount", 
      key: "claimAmount", 
      value: '', 
      showForTypes: ['form-31'],
      icon: <DollarSign className="h-4 w-4 text-green-500" />
    },
    { 
      label: "Claim Type", 
      key: "claimType", 
      value: '', 
      showForTypes: ['form-31'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Security Details", 
      key: "securityDetails", 
      value: '', 
      showForTypes: ['form-31'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    }
  ], [
    clientName, trusteeName, administratorName, dateSigned, formNumber, 
    estateNumber, district, divisionNumber, courtNumber, meetingOfCreditors,
    chairInfo, securityInfo, dateBankruptcy, officialReceiver,
    documentStatus, filingDate, submissionDeadline
  ]);

  const getRelevantFields = (formType?: string) => {
    // For Form 31, show specific fields and order them appropriately
    if (formType === 'form-31') {
      const form31Fields = fields.filter(field => 
        field.showForTypes.includes('all') || 
        field.showForTypes.includes('form-31')
      );
      
      // Sort form 31 fields in a logical order
      return form31Fields.sort((a, b) => {
        const order: Record<string, number> = {
          'documentStatus': 1,
          'formNumber': 2,
          'creditorName': 3,
          'claimAmount': 4,
          'claimType': 5,
          'securityDetails': 6,
          'clientName': 7, // Debtor name
          'filingDate': 8,
          'dateSigned': 9,
          'estateNumber': 10,
          'trusteeName': 11,
          'submissionDeadline': 12
        };
        
        return (order[a.key] || 99) - (order[b.key] || 99);
      });
    }
    
    // For Form 47, show specific fields and order them appropriately
    if (formType === 'form-47') {
      const form47Fields = fields.filter(field => 
        field.showForTypes.includes('all') || 
        field.showForTypes.includes('form-47')
      );
      
      // Sort form 47 fields in a logical order
      return form47Fields.sort((a, b) => {
        const order: Record<string, number> = {
          'documentStatus': 1,
          'formNumber': 2,
          'clientName': 3,
          'administratorName': 4,
          'filingDate': 5,
          'submissionDeadline': 6,
          'dateSigned': 7,
          'securedCreditorsPayment': 8,
          'unsecuredCreditorsPayment': 9,
          'meetingOfCreditors': 10
        };
        
        return (order[a.key] || 99) - (order[b.key] || 99);
      });
    }
    
    return fields.filter(field => 
      field.showForTypes.includes('all') || 
      field.showForTypes.includes(formType?.toLowerCase() || '')
    );
  };

  return { fields, getRelevantFields };
};
