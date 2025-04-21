
import { Calendar } from "lucide-react";
import { DeadlineManager } from "../DeadlineManager";
import { Separator } from "@/components/ui/separator";

interface SidebarDeadlinesProps {
  formType: string | undefined;
  document: any;
  onDeadlineUpdated: () => void;
}

export const SidebarDeadlines: React.FC<SidebarDeadlinesProps> = ({ formType, document, onDeadlineUpdated }) => {
  const isForm47 = formType === "form-47";
  const isForm31 = formType === "form-31";
  return (
    <div className="sidebar-section">
      <div className="sidebar-section-header">
        <Calendar className="h-4 w-4 text-blue-500" />
        <h3 className="sidebar-section-title">
          {isForm47 ? "Proposal Deadlines" : isForm31 ? "Claim Deadlines" : "Deadlines & Compliance"}
        </h3>
      </div>
      <DeadlineManager document={document} onDeadlineUpdated={onDeadlineUpdated} />
      <Separator className="my-3" />
    </div>
  );
};
