
import { AlertCircle } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Form47AlertProps {
  form47Documents: Document[];
}

export const Form47Alert = ({ form47Documents }: Form47AlertProps) => {
  // Always return null to remove the Consumer Proposal warning
  return null;
};
