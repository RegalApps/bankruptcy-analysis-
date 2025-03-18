
import { useState } from "react";

export const useClientTabs = () => {
  const [activeTab, setActiveTab] = useState("documents");
  
  return {
    activeTab,
    setActiveTab
  };
};
