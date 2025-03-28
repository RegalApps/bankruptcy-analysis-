
import { useState } from "react";

export const useClientTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("info");

  return {
    activeTab,
    setActiveTab
  };
};
