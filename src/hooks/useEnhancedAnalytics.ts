import { useEffect, useState, useCallback, useMemo } from 'react';
import { analyticsService, EventCategory, EventSubcategory, EventTrend } from '@/services/analyticsService';
import { useDebouncedCallback } from './useDebounce';

interface UseEnhancedAnalyticsOptions {
  enablePersistence?: boolean;
  userRole?: string;
}

/**
 * Enhanced analytics hook that provides analytics tracking functionality
 */
export const useEnhancedAnalytics = (options: UseEnhancedAnalyticsOptions = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { enablePersistence = true, userRole = 'user' } = options;
  
  // Initialize analytics service
  useEffect(() => {
    const initAnalytics = async () => {
      try {
        await analyticsService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize analytics service:', error);
      }
    };
    
    initAnalytics();
  }, []);
  
  // Set up user role when provided
  useEffect(() => {
    if (userRole && analyticsService.setUserRole) {
      analyticsService.setUserRole(userRole);
    }
  }, [userRole]);
  
  // Set up persistence configuration
  useEffect(() => {
    if (isInitialized && analyticsService.setPersistenceEnabled) {
      analyticsService.setPersistenceEnabled(enablePersistence);
    }
  }, [enablePersistence, isInitialized]);
  
  // Track page view with debounce to prevent duplicate events
  const trackPageView = useCallback((pageName: string) => {
    if (isInitialized) {
      return analyticsService.trackPageView(pageName);
    }
  }, [isInitialized]);
  
  const debouncedTrackPageView = useDebouncedCallback(trackPageView, 300);
  
  // Get event trends for a specific period (for dashboard components)
  const getEventTrends = useCallback(async (
    period: 'day' | 'week' | 'month' = 'day',
    options: any = {}
  ) => {
    if (!isInitialized) return [];
    
    try {
      const trends = await analyticsService.getEventTrends(period, options);
      return trends;
    } catch (error) {
      console.error('Error fetching event trends:', error);
      return [];
    }
  }, [isInitialized]);
  
  // Track interaction in a more user-friendly way
  const trackInteraction = useCallback((
    component: string, 
    action: string, 
    subcategory: EventSubcategory = 'Click' as EventSubcategory, 
    metadata?: Record<string, any>
  ) => {
    if (!isInitialized) return;
    analyticsService.trackInteraction(component, action, subcategory, metadata);
  }, [isInitialized]);
  
  // Return analytics utility functions
  return useMemo(() => ({
    // Track events
    trackEvent: (event: any) => analyticsService.trackEvent(event),
    trackPageView: debouncedTrackPageView,
    trackDocumentEvent: (action: string, documentId: string, subcategory?: EventSubcategory, metadata?: any) => 
      analyticsService.trackDocumentEvent(action, documentId, subcategory, metadata),
    trackClientEvent: (action: string, clientId: string, subcategory?: EventSubcategory, metadata?: any) => 
      analyticsService.trackClientEvent ? analyticsService.trackClientEvent(action, clientId, subcategory, metadata) : null,
    trackError: (errorType: string, message: string, metadata?: any) => 
      analyticsService.trackError ? analyticsService.trackError(errorType, message, metadata) : null,
    trackInteraction,
    
    // Get analytics data
    getAnalyticsData: () => analyticsService.getAnalyticsData(),
    getMetrics: () => analyticsService.getMetrics(),
    getPageViewData: () => analyticsService.getPageViewData ? analyticsService.getPageViewData() : [],
    getEventsByCategory: () => analyticsService.getEventsByCategory ? analyticsService.getEventsByCategory() : [],
    getEventsBySubcategory: () => analyticsService.getEventsBySubcategory ? analyticsService.getEventsBySubcategory() : [],
    getHistoricalData: () => analyticsService.getHistoricalData(),
    getEventTrends,
    
    // State
    isInitialized,
    
    // Configuration
    setUserRole: (role: string) => analyticsService.setUserRole ? analyticsService.setUserRole(role) : null,
    setPersistenceEnabled: (enabled: boolean) => analyticsService.setPersistenceEnabled ? analyticsService.setPersistenceEnabled(enabled) : null,
  }), [
    isInitialized, 
    debouncedTrackPageView, 
    trackInteraction, 
    getEventTrends
  ]);
};
