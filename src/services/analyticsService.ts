
import { startTiming, endTiming } from "@/utils/performanceMonitor";

// Types for analytics events
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Analytics data store
class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isInitialized: boolean = false;
  private sessionStartTime: number = Date.now();
  private pageViewTimes: Record<string, number> = {};
  
  constructor() {
    // Initialize on first instantiation
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }
  
  initialize() {
    if (this.isInitialized) return;
    
    console.log('Analytics service initialized');
    this.sessionStartTime = Date.now();
    this.isInitialized = true;
    
    // Track page navigation
    if (typeof window !== 'undefined') {
      // Track page unload to measure session duration
      window.addEventListener('beforeunload', () => {
        this.trackEvent({
          category: 'Session',
          action: 'End',
          value: Math.floor((Date.now() - this.sessionStartTime) / 1000)
        });
      });
    }
  }
  
  // Track an analytics event
  trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };
    
    this.events.push(fullEvent);
    console.log('Analytics event tracked:', fullEvent);
    
    // In a real app, you might send this to a backend or analytics service
    // this.sendToAnalyticsBackend(fullEvent);
  }
  
  // Track page view with timing
  trackPageView(pageName: string) {
    startTiming(`page-view-${pageName}`);
    this.pageViewTimes[pageName] = Date.now();
    
    this.trackEvent({
      category: 'Page',
      action: 'View',
      label: pageName
    });
    
    return () => {
      if (this.pageViewTimes[pageName]) {
        const duration = Date.now() - this.pageViewTimes[pageName];
        this.trackEvent({
          category: 'Page',
          action: 'Duration',
          label: pageName,
          value: Math.floor(duration / 1000)
        });
        endTiming(`page-view-${pageName}`);
        delete this.pageViewTimes[pageName];
      }
    };
  }
  
  // Track user interactions
  trackInteraction(component: string, action: string, metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Interaction',
      action: action,
      label: component,
      metadata
    });
  }
  
  // Get analytics data for dashboards
  getAnalyticsData(category?: string, timeRange: number = 7 * 24 * 60 * 60 * 1000) {
    const cutoffTime = Date.now() - timeRange;
    let filteredEvents = this.events.filter(event => event.timestamp >= cutoffTime);
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    return filteredEvents;
  }
  
  // Calculate metrics based on collected events
  getMetrics() {
    const pageViews = this.events.filter(e => e.category === 'Page' && e.action === 'View');
    const interactions = this.events.filter(e => e.category === 'Interaction');
    
    const uniquePages = new Set(pageViews.map(e => e.label)).size;
    
    return {
      totalEvents: this.events.length,
      pageViews: pageViews.length,
      uniquePages,
      interactions: interactions.length,
      sessionDuration: Math.floor((Date.now() - this.sessionStartTime) / 1000),
    };
  }
  
  // Get page view data for charts
  getPageViewData() {
    const pageViews = this.events.filter(e => e.category === 'Page' && e.action === 'View');
    const pageViewCounts: Record<string, number> = {};
    
    pageViews.forEach(event => {
      if (event.label) {
        pageViewCounts[event.label] = (pageViewCounts[event.label] || 0) + 1;
      }
    });
    
    return Object.entries(pageViewCounts).map(([page, count]) => ({
      name: page,
      views: count
    }));
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
