
import { useEffect, useState } from 'react';
import { analyticsService, EventCategory, EventSubcategory, EventTrend } from '@/services/analyticsService';

interface UseEnhancedAnalyticsOptions {
  pageName?: string;
  userRole?: string;
  enablePersistence?: boolean;
}

export const useEnhancedAnalytics = ({
  pageName,
  userRole = 'user',
  enablePersistence = true
}: UseEnhancedAnalyticsOptions = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [trendData, setTrendData] = useState<EventTrend[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  
  // Initialize analytics with configuration
  useEffect(() => {
    // Set user role for analytics
    analyticsService.setUserRole(userRole);
    
    // Configure persistence
    analyticsService.setPersistenceEnabled(enablePersistence);
    
    setIsInitialized(true);
  }, [userRole, enablePersistence]);
  
  // Track page view if pageName is provided
  useEffect(() => {
    if (pageName && isInitialized) {
      // Track page view and return cleanup function
      return analyticsService.trackPageView(pageName);
    }
  }, [pageName, isInitialized]);
  
  // Function to fetch trend data
  const fetchTrendData = async (
    period: 'day' | 'week' | 'month' = 'day',
    options: {
      category?: EventCategory;
      subcategory?: EventSubcategory;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) => {
    setIsLoadingTrends(true);
    
    try {
      const trends = await analyticsService.getEventTrends(period, {
        ...options,
        userRole
      });
      
      setTrendData(trends);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setIsLoadingTrends(false);
    }
  };
  
  return {
    // Event tracking methods
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackInteraction: analyticsService.trackInteraction.bind(analyticsService),
    trackDocumentEvent: analyticsService.trackDocumentEvent.bind(analyticsService),
    trackClientEvent: analyticsService.trackClientEvent.bind(analyticsService),
    trackError: analyticsService.trackError.bind(analyticsService),
    
    // Data retrieval methods
    getAnalyticsData: analyticsService.getAnalyticsData.bind(analyticsService),
    getMetrics: analyticsService.getMetrics.bind(analyticsService),
    getPageViewData: analyticsService.getPageViewData.bind(analyticsService),
    getEventsByCategory: analyticsService.getEventsByCategory.bind(analyticsService),
    getEventsBySubcategory: analyticsService.getEventsBySubcategory.bind(analyticsService),
    getHistoricalData: analyticsService.getHistoricalData.bind(analyticsService),
    
    // Trend data and fetching
    trendData,
    isLoadingTrends,
    fetchTrendData,
    
    // Configuration
    setUserRole: analyticsService.setUserRole.bind(analyticsService),
    setPersistenceEnabled: analyticsService.setPersistenceEnabled.bind(analyticsService),
  };
};
