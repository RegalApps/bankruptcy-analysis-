
import { useMemo } from 'react';
import { FileText, User, Calendar, Building } from "lucide-react";
import { EditableField } from "../types";

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
      label: "Licensed Insolvency Trustee", 
      key: "trusteeName", 
      value: trusteeName || '', 
      showForTypes: ['form-76', 'bankruptcy'],
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
      label: "Document Status", 
      key: "documentStatus", 
      value: documentStatus || '', 
      showForTypes: ['form-47', 'proposal'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Filing Date", 
      key: "filingDate", 
      value: filingDate ? new Date(filingDate).toLocaleDateString() : '', 
      showForTypes: ['form-47', 'form-76', 'proposal', 'bankruptcy'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Submission Deadline", 
      key: "submissionDeadline", 
      value: submissionDeadline ? new Date(submissionDeadline).toLocaleDateString() : '', 
      showForTypes: ['form-47', 'form-76', 'proposal', 'bankruptcy'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Estate Number", 
      key: "estateNumber", 
      value: estateNumber || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "District", 
      key: "district", 
      value: district || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <Building className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Division Number", 
      key: "divisionNumber", 
      value: divisionNumber || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Court Number", 
      key: "courtNumber", 
      value: courtNumber || '', 
      showForTypes: ['bankruptcy', 'proposal', 'court'],
      icon: <Building className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Meeting of Creditors", 
      key: "meetingOfCreditors", 
      value: meetingOfCreditors || '', 
      showForTypes: ['bankruptcy', 'proposal', 'meeting'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Chair Information", 
      key: "chairInfo", 
      value: chairInfo || '', 
      showForTypes: ['meeting'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Security Information", 
      key: "securityInfo", 
      value: securityInfo || '', 
      showForTypes: ['security'],
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Date of Bankruptcy", 
      key: "dateBankruptcy", 
      value: dateBankruptcy || '', 
      showForTypes: ['bankruptcy'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Date Signed", 
      key: "dateSigned", 
      value: dateSigned || '', 
      showForTypes: ['all'],
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />
    },
    { 
      label: "Official Receiver", 
      key: "officialReceiver", 
      value: officialReceiver || '', 
      showForTypes: ['bankruptcy', 'proposal'],
      icon: <User className="h-4 w-4 text-muted-foreground" />
    }
  ], [
    clientName, trusteeName, administratorName, dateSigned, formNumber, 
    estateNumber, district, divisionNumber, courtNumber, meetingOfCreditors,
    chairInfo, securityInfo, dateBankruptcy, officialReceiver,
    documentStatus, filingDate, submissionDeadline
  ]);

  const getRelevantFields = (formType?: string) => {
    if (!formType) return fields;
    return fields.filter(field => 
      field.showForTypes.includes('all') || 
      field.showForTypes.includes(formType.toLowerCase())
    );
  };

  return { fields, getRelevantFields };
};
