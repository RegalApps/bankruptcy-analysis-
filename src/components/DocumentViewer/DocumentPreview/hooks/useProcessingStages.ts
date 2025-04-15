
import { useState, useCallback } from "react";

export const useProcessingStages = () => {
  const [currentStage, setCurrentStage] = useState<string>("");
  
  const runProcessingStage = useCallback(async (stage: string, onComplete: () => void) => {
    setCurrentStage(stage);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Call the completion callback
    onComplete();
    
    return true;
  }, []);
  
  return {
    runProcessingStage,
    currentStage
  };
};
