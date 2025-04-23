/**
 * Analytics Service - Disabled Version
 * 
 * This service has been disabled as part of application simplification.
 * All methods return empty or mock data to prevent errors in components
 * that may still reference them.
 */

import logger from '@/utils/logger';

// Basic event types to maintain compatibility
export type EventCategory = string;
export type EventSubcategory = string;

export interface AnalyticsEvent {
  id?: string;
  category: EventCategory;
  subcategory?: EventSubcategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  userRole?: string;
}

export interface EventTrend {
  period: string;
  count: number;
  category: string;
  subcategory?: string;
}

// Simplified service with no-op functions
class AnalyticsService {
  initialize() {
    logger.info('Analytics service disabled - no initialization performed');
    return Promise.resolve(true);
  }

  setUserRole(role: string) {
    logger.debug(`Analytics service disabled - would set user role: ${role}`);
    return Promise.resolve();
  }

  setPersistenceEnabled(enabled: boolean) {
    logger.debug(`Analytics service disabled - would set persistence enabled: ${enabled}`);
    return Promise.resolve();
  }

  trackEvent(event: any) {
    // No-op implementation
    return Promise.resolve();
  }

  trackPageView(pageName: string) {
    // No-op implementation
    return Promise.resolve();
  }

  trackInteraction(component: string, action: string, subcategory?: string, metadata?: Record<string, any>) {
    // No-op implementation
    return Promise.resolve();
  }

  trackDocumentEvent(action: string, documentId: string, subcategory?: string, metadata?: Record<string, any>) {
    // No-op implementation
    return Promise.resolve();
  }

  trackClientEvent(action: string, clientId: string, subcategory?: string, metadata?: Record<string, any>) {
    // No-op implementation
    return Promise.resolve();
  }

  trackError(errorType: string, message: string, metadata?: Record<string, any>) {
    // No-op implementation
    return Promise.resolve();
  }

  getAnalyticsData() {
    // Return empty array
    return Promise.resolve([]);
  }

  getHistoricalData() {
    // Return empty array
    return Promise.resolve([]);
  }

  getEventTrends(period: string = 'day', options: any = {}) {
    // Return empty array
    return Promise.resolve([]);
  }

  getMetrics() {
    // Return empty metrics
    return {
      totalEvents: 0,
      pageViews: 0,
      uniquePages: 0,
      interactions: 0,
      sessionDuration: 0
    };
  }

  getPageViewData() {
    // Return empty array
    return [];
  }

  getEventsByCategory() {
    // Return empty array
    return [];
  }

  getEventsBySubcategory() {
    // Return empty array
    return [];
  }

  syncEvents() {
    // No-op implementation
    return Promise.resolve();
  }

  forceSyncEvents() {
    // No-op implementation
    return Promise.resolve();
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
