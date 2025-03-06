
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentHeaderProps {
  title: string;
  type: string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ title, type }) => {
  const isForm47 = type === 'form-47' || type.toLowerCase().includes('consumer proposal');
  
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-md bg-primary/10 mt-0.5">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={isForm47 ? "default" : "outline"} className="text-xs">
            {isForm47 ? 'Consumer Proposal' : type}
          </Badge>
          {isForm47 && <Badge variant="outline" className="text-xs">Form 47</Badge>}
        </div>
      </div>
    </div>
  );
};
