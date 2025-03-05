
import { useState } from "react";
import { useConversations } from "../../hooks/useConversations";
import { CategorySelector } from "./CategorySelector";
import { DocumentModuleContent } from "./ModuleContents/DocumentModuleContent";
import { LegalModuleContent } from "./ModuleContents/LegalModuleContent";
import { HelpModuleContent } from "./ModuleContents/HelpModuleContent";
import { ClientConversation } from "../ClientConnect/ClientConversation";
import { RecentConversations } from "./RecentConversations";

interface SidebarContentProps {
  activeModule: 'document' | 'legal' | 'help' | 'client';
  setActiveModule: (module: 'document' | 'legal' | 'help' | 'client') => void;
  onUploadComplete: (documentId: string) => Promise<void>;
}

export const Sidebar = ({ activeModule, setActiveModule, onUploadComplete }: SidebarContentProps) => {
  const { categoryMessages, handleSendMessage, isProcessing } = useConversations(activeModule);
  const [showConversation, setShowConversation] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const handleStartConsultation = async () => {
    setActiveModule('client');
    setShowConversation(true);
    await handleSendMessage("Hello, I'd like to start a consultation.");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleMessageSend = () => {
    handleSendMessage(inputMessage);
    setInputMessage("");
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'document':
        return (
          <DocumentModuleContent
            messages={categoryMessages.document}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleKeyPress={handleKeyPress}
            handleMessageSend={handleMessageSend}
            isProcessing={isProcessing}
            onUploadComplete={onUploadComplete}
          />
        );
      case 'legal':
        return (
          <LegalModuleContent
            messages={categoryMessages.legal}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleKeyPress={handleKeyPress}
            handleMessageSend={handleMessageSend}
            isProcessing={isProcessing}
          />
        );
      case 'help':
        return (
          <HelpModuleContent
            messages={categoryMessages.help}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleKeyPress={handleKeyPress}
            handleMessageSend={handleMessageSend}
            isProcessing={isProcessing}
          />
        );
      case 'client':
        return showConversation && (
          <ClientConversation
            messages={categoryMessages.client}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleMessageSend}
            handleKeyPress={handleKeyPress}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r bg-muted/30 overflow-y-auto h-full">
        <div className="p-4 space-y-4">
          <CategorySelector 
            activeModule={activeModule} 
            setActiveModule={setActiveModule}
            handleStartConsultation={handleStartConsultation}
            showConversation={showConversation}
            isProcessing={isProcessing}
            onUploadComplete={onUploadComplete}
          />
          <RecentConversations />
        </div>
      </aside>

      {renderModuleContent()}
    </div>
  );
};
