
import { useState, useCallback } from "react";

export const useProcessingStages = () => {
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [stageHistory, setStageHistory] = useState<{name: string, timestamp: number}[]>([]);

  const runProcessingStage = useCallback(async (
    stageName: string,
    onProgress?: (progress: number) => void,
    duration: number = 500
  ) => {
    // Set the current stage
    setCurrentStage(stageName);
    setStageProgress(0);
    
    // Add to history
    setStageHistory(prev => [...prev, {name: stageName, timestamp: Date.now()}]);
    
    // Log for debugging
    console.log(`Processing stage: ${stageName}`);
    
    // Simulate processing time with progress updates
    const startTime = Date.now();
    const updateInterval = 50; // Update progress every 50ms
    
    return new Promise<{success: boolean, stageName: string}>((resolve) => {
      const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
        
        setStageProgress(progress);
        
        if (onProgress) {
          onProgress(progress);
        }
        
        if (progress >= 100) {
          clearInterval(intervalId);
          resolve({ success: true, stageName });
        }
      }, updateInterval);
    });
  }, []);
  
  const resetStages = useCallback(() => {
    setCurrentStage(null);
    setStageProgress(0);
    setStageHistory([]);
  }, []);

  return {
    currentStage,
    stageProgress,
    stageHistory,
    runProcessingStage,
    resetStages
  };
};
