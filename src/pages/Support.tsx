
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SupportDashboard } from "@/components/support/SupportDashboard";
import { SupportChatbot } from "@/components/support/SupportChatbot";
import { SupportTicketsList } from "@/components/support/SupportTicketsList";
import { SupportCategorySidebar } from "@/components/support/SupportCategorySidebar";
import { SupportHeader } from "@/components/support/SupportHeader";

export const Support = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  return (
    <MainLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
        <SupportHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setShowChatbot={setShowChatbot}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <SupportCategorySidebar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <SupportDashboard 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </div>
          
          {showChatbot && (
            <SupportChatbot onClose={() => setShowChatbot(false)} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
