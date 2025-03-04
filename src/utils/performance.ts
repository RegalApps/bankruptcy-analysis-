
import { toast } from "@/components/ui/use-toast";

interface PerformanceMetrics {
  pageLoadTime: number;
  resourceLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  fullRender: number;
}

export const measurePagePerformance = (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    // Wait for the page to fully load
    window.addEventListener('load', () => {
      // Use requestAnimationFrame to ensure all painting is done
      requestAnimationFrame(() => {
        setTimeout(() => {
          const performance = window.performance;
          
          if (!performance) {
            console.error("Performance API not supported");
            return;
          }
          
          // Get performance entries
          const perfEntries = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
          const paintEntries = performance.getEntriesByType("paint");
          
          // Calculate metrics
          const pageLoadTime = perfEntries.loadEventEnd - perfEntries.startTime;
          const domContentLoaded = perfEntries.domContentLoadedEventEnd - perfEntries.startTime;
          const resourceLoadTime = perfEntries.loadEventEnd - perfEntries.domContentLoadedEventEnd;
          
          // Find first paint time
          let firstPaint = 0;
          const firstPaintEntry = paintEntries.find(entry => entry.name === "first-paint");
          if (firstPaintEntry) {
            firstPaint = firstPaintEntry.startTime;
          }
          
          // Full render time (estimation)
          const fullRender = pageLoadTime;
          
          resolve({
            pageLoadTime,
            resourceLoadTime,
            domContentLoaded,
            firstPaint,
            fullRender
          });
          
          // Log for debugging
          console.log("Performance metrics:", {
            pageLoadTime: `${pageLoadTime.toFixed(0)}ms`,
            resourceLoadTime: `${resourceLoadTime.toFixed(0)}ms`,
            domContentLoaded: `${domContentLoaded.toFixed(0)}ms`,
            firstPaint: `${firstPaint.toFixed(0)}ms`,
            fullRender: `${fullRender.toFixed(0)}ms`
          });
        }, 100); // Small delay to ensure everything is captured
      });
    });
  });
};

export const showPerformanceToast = async (pageName: string) => {
  const metrics = await measurePagePerformance();
  
  toast({
    title: `${pageName} Performance`,
    description: (
      <div className="space-y-1 mt-2">
        <div className="text-xs">Page load: {metrics.pageLoadTime.toFixed(0)}ms</div>
        <div className="text-xs">First paint: {metrics.firstPaint.toFixed(0)}ms</div>
        <div className="text-xs">Full render: {metrics.fullRender.toFixed(0)}ms</div>
      </div>
    ),
    duration: 5000,
  });
};
