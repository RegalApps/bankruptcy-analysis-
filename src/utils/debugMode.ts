
import { toast } from "sonner";

// Debug mode state
let isDebugModeActive = false;
let debugMetadata: Record<string, any> = {};

/**
 * Activates debug mode with specific configurations
 */
export const activateDebugMode = (options: {
  formType?: string;
  skipProcessing?: boolean;
  viewMode?: string;
  documentId?: string;
  suppressRedirect?: boolean;
}) => {
  isDebugModeActive = true;
  debugMetadata = {
    ...options,
    activatedAt: new Date().toISOString(),
    debugMode: true
  };
  
  // Log debug mode activation
  console.log("🛠️ DEBUG MODE ACTIVATED:", debugMetadata);
  toast.info("Debug Mode Activated", {
    description: `Form: ${options.formType || "Not specified"}`,
    duration: 3000
  });
  
  return debugMetadata;
};

/**
 * Checks if debug mode is active
 */
export const isDebugMode = () => isDebugModeActive;

/**
 * Returns current debug metadata
 */
export const getDebugMetadata = () => debugMetadata;

/**
 * Adds performance timing in debug mode
 */
export const debugTiming = (operation: string, durationMs: number) => {
  if (!isDebugModeActive) return;
  
  console.log(`🛠️ DEBUG TIMING: ${operation} took ${durationMs}ms`);
  
  if (durationMs > 1000) {
    console.warn(`⚠️ Performance warning: ${operation} took ${(durationMs/1000).toFixed(1)}s`);
  }
};

/**
 * Disables debug mode
 */
export const deactivateDebugMode = () => {
  isDebugModeActive = false;
  debugMetadata = {};
  console.log("Debug mode deactivated");
};
