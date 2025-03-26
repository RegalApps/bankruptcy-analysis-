
import { toast } from "sonner";
import { startTiming, endTiming } from "./performanceMonitor";
import { analyticsService } from "@/services/analyticsService";

/**
 * Shows a performance toast for a specific page or operation
 */
export const showPerformanceToast = (pageName: string) => {
  // End timing for page load
  const loadTime = endTiming(`page-load-${pageName}`);
  
  // Track the performance metric
  if (loadTime) {
    analyticsService.trackEvent({
      category: 'Performance',
      subcategory: 'Load',
      action: 'PageLoad',
      label: pageName,
      value: Math.round(loadTime)
    });
    
    // Show toast for slow page loads (> 500ms)
    if (loadTime > 500) {
      toast.info(
        `${pageName} loaded in ${(loadTime / 1000).toFixed(1)}s`, 
        { duration: 3000, position: 'bottom-right' }
      );
    }
  }
  
  // Start timing for page interactions
  startTiming(`page-interact-${pageName}`);
};

/**
 * Measures and reports navigation performance
 */
export const measureRouteChange = (from: string, to: string) => {
  // End timing for previous page
  const interactionTime = endTiming(`page-interact-${from}`);
  
  // Track page interaction time
  if (interactionTime) {
    analyticsService.trackEvent({
      category: 'Performance',
      subcategory: 'Interaction',
      action: 'PageInteraction',
      label: from,
      value: Math.round(interactionTime)
    });
  }
  
  // Track navigation event
  analyticsService.trackEvent({
    category: 'Navigation',
    subcategory: 'Navigation',
    action: 'RouteChange',
    label: `${from} → ${to}`
  });
  
  // Start timing for next page load
  startTiming(`page-load-${to}`);
  
  // Reset document load timings when changing routes
  try {
    performance.clearMarks('document-load-start');
    performance.clearMarks('document-load-end');
  } catch (e) {
    // Ignore errors in browsers that don't support this
  }
};

/**
 * Measures document loading performance
 */
export const measureDocumentLoad = (documentId: string) => {
  startTiming(`document-load-${documentId}`);
  
  // Return cleanup function
  return () => {
    const loadTime = endTiming(`document-load-${documentId}`);
    
    if (loadTime) {
      // Track document load performance
      analyticsService.trackEvent({
        category: 'Document',
        subcategory: 'Load',
        action: 'DocumentLoad',
        label: documentId,
        value: Math.round(loadTime)
      });
      
      // Log warning for slow document loads
      if (loadTime > 1000) {
        console.warn(`Document ${documentId} took ${(loadTime / 1000).toFixed(1)}s to load`);
        
        // Track slow document load as a performance issue
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Issue',
          action: 'SlowDocumentLoad',
          label: documentId,
          value: Math.round(loadTime),
          metadata: {
            threshold: 1000,
            exceedAmount: loadTime - 1000
          }
        });
      }
    }
  };
};

/**
 * Measures API call performance
 */
export const measureApiCall = (apiName: string) => {
  startTiming(`api-call-${apiName}`);
  
  return () => {
    const apiTime = endTiming(`api-call-${apiName}`);
    
    if (apiTime) {
      // Track API call performance
      analyticsService.trackEvent({
        category: 'API',
        subcategory: 'Performance',
        action: 'ApiCall',
        label: apiName,
        value: Math.round(apiTime)
      });
      
      // Log warning for slow API calls
      if (apiTime > 500) {
        console.warn(`API call to ${apiName} took ${apiTime.toFixed(1)}ms`);
        
        // Track slow API call as a performance issue
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Issue',
          action: 'SlowApiCall',
          label: apiName,
          value: Math.round(apiTime),
          metadata: {
            threshold: 500,
            exceedAmount: apiTime - 500
          }
        });
      }
    }
  };
};

/**
 * Measures component render performance
 */
export const measureComponentRender = (componentName: string) => {
  startTiming(`component-render-${componentName}`);
  
  return () => {
    const renderTime = endTiming(`component-render-${componentName}`);
    
    if (renderTime) {
      // Track component render performance
      analyticsService.trackEvent({
        category: 'Performance',
        subcategory: 'Render',
        action: 'ComponentRender',
        label: componentName,
        value: Math.round(renderTime)
      });
      
      // Log warning for slow component renders
      if (renderTime > 100) {
        console.warn(`Component ${componentName} took ${renderTime.toFixed(1)}ms to render`);
        
        // Track slow component render as a performance issue
        analyticsService.trackEvent({
          category: 'Performance',
          subcategory: 'Issue',
          action: 'SlowComponentRender',
          label: componentName,
          value: Math.round(renderTime),
          metadata: {
            threshold: 100,
            exceedAmount: renderTime - 100
          }
        });
      }
    }
  };
};
