
import { useEnhancedAnalytics } from "./useEnhancedAnalytics";

/**
 * A simpler hook that wraps useEnhancedAnalytics for easier usage in components
 * that only need basic analytics functionality
 */
export function useAnalytics() {
  const analytics = useEnhancedAnalytics({
    enablePersistence: true
  });
  
  return analytics;
}
