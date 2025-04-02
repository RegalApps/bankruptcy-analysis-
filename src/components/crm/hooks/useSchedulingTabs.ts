
import { useState } from "react";

export const useSchedulingTabs = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  
  return {
    activeTab,
    setActiveTab
  };
};
