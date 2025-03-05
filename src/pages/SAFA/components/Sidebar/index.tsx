
import { Sidebar as SidebarContent } from "./SidebarContent";

interface SidebarProps {
  activeModule: 'document' | 'legal' | 'help' | 'client';
  setActiveModule: (module: 'document' | 'legal' | 'help' | 'client') => void;
  onUploadComplete: (documentId: string) => Promise<void>;
}

export const Sidebar = (props: SidebarProps) => {
  return <SidebarContent {...props} />;
};
