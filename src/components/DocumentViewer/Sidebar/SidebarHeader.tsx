
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isDarkMode: boolean;
}
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isDarkMode }) => (
  <div className={cn("p-3 border-b border-border/50 bg-muted/30")}>
    <h3 className="font-medium text-sm">Document Details</h3>
  </div>
);
