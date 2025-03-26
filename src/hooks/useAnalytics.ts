
import { useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';

export const useAnalytics = (pageName?: string) => {
  useEffect(() => {
    if (pageName) {
      // Track page view and return cleanup function
      return analyticsService.trackPageView(pageName);
    }
  }, [pageName]);
  
  return {
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackInteraction: analyticsService.trackInteraction.bind(analyticsService),
    getAnalyticsData: analyticsService.getAnalyticsData.bind(analyticsService),
    getMetrics: analyticsService.getMetrics.bind(analyticsService),
    getPageViewData: analyticsService.getPageViewData.bind(analyticsService),
  };
};
