
import { useState, useCallback } from "react";

export const useProcessingStages = () => {
  const [currentStage, setCurrentStage] = useState<string | null>(null);

  const runProcessingStage = useCallback(async (
    stageName: string,
    onProgress?: () => void
  ) => {
    // Set the current stage
    setCurrentStage(stageName);
    
    // Log for debugging
    console.log(`Processing stage: ${stageName}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (onProgress) {
      onProgress();
    }
    
    // Return a mock result for now
    return { success: true, stageName };
  }, []);

  return {
    currentStage,
    runProcessingStage
  };
};
