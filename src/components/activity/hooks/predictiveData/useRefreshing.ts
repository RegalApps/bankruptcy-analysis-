
import { useState } from "react";

export const useRefreshing = (
  setLastRefreshed: (date: Date) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const refetch = () => {
    // This will trigger a re-fetch via the effect
    console.log("Manually refreshing predictive data");
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsLoading(false);
    }, 1200);
  };

  return {
    refetch
  };
};
