
import { supabase } from "@/integrations/supabase/client";
import { startTiming, endTiming } from "@/utils/performanceMonitor";
import { toast } from "sonner";

// Define more granular event categories
export type EventCategory = 
  | 'Page' 
  | 'Interaction' 
  | 'Document' 
  | 'Client' 
  | 'Session' 
  | 'Performance' 
  | 'Error' 
  | 'Security' 
  | 'Financial' 
  | 'Workflow'
  | 'Navigation'  // Add missing categories
  | 'API';

// Subcategories for more granular tracking
export type EventSubcategory = 
  | 'View' 
  | 'Click' 
  | 'Input' 
  | 'Validation' 
  | 'Upload' 
  | 'Download' 
  | 'Create' 
  | 'Update' 
  | 'Delete' 
  | 'Search' 
  | 'Filter' 
  | 'Sort' 
  | 'Export' 
  | 'Import' 
  | 'Navigation' 
  | 'Submission' 
  | 'Load' 
  | 'Error' 
  | 'Success' 
  | 'Warning'
  | 'Duration'  // Add missing subcategories
  | 'Issue'
  | 'Performance'
  | 'Render'
  | 'Interaction';

// Types for analytics events
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

// Type for event trends
export interface EventTrend {
  period: string;
  count: number;
  category: string;
  subcategory?: string;
}

// Mock historical data array for demo purposes
const mockHistoricalData: AnalyticsEvent[] = [];

// Analytics data store
class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isInitialized: boolean = false;
  private sessionStartTime: number = Date.now();
  private pageViewTimes: Record<string, number> = {};
  private sessionId: string = '';
  private syncInterval: number | null = null;
  private persistenceEnabled: boolean = true;
  private userRole: string = 'user';
  
  constructor() {
    // Initialize on first instantiation
    if (typeof window !== 'undefined') {
      this.initialize();
    }
    
    // Generate some mock historical data
    this.generateMockData();
  }
  
  // Generate mock historical data for demo
  private generateMockData() {
    const categories: EventCategory[] = ['Page', 'Interaction', 'Document', 'Performance', 'Error'];
    const subcategories: EventSubcategory[] = ['View', 'Click', 'Load', 'Error', 'Success'];
    const actions = ['View', 'Click', 'Submit', 'Load', 'Error'];
    
    // Generate last 30 days of data
    for (let i = 0; i < 500; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      mockHistoricalData.push({
        id: `mock-${i}`,
        category,
        subcategory,
        action,
        label: `mock-label-${i % 10}`,
        value: Math.floor(Math.random() * 100),
        timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (Math.random() * 86400000),
        sessionId: `mock-session-${Math.floor(i / 20)}`,
        userRole: i % 5 === 0 ? 'admin' : i % 3 === 0 ? 'manager' : 'user'
      });
    }
  }
  
  initialize() {
    if (this.isInitialized) return;
    
    console.log('Analytics service initialized');
    this.sessionStartTime = Date.now();
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.isInitialized = true;
    
    // Track page navigation
    if (typeof window !== 'undefined') {
      // Track page unload to measure session duration
      window.addEventListener('beforeunload', () => {
        this.trackEvent({
          category: 'Session',
          subcategory: 'View',
          action: 'End',
          value: Math.floor((Date.now() - this.sessionStartTime) / 1000)
        });
        
        // Sync remaining events before page unload
        this.forceSyncEvents();
      });
    }
    
    // Setup automatic syncing of events every 30 seconds
    if (this.persistenceEnabled) {
      this.syncInterval = window.setInterval(() => {
        this.syncEvents();
      }, 30000);
    }
  }

  /**
   * Set the current user role for role-based analytics
   */
  setUserRole(role: string) {
    this.userRole = role;
  }
  
  /**
   * Enable or disable server persistence
   */
  setPersistenceEnabled(enabled: boolean) {
    this.persistenceEnabled = enabled;
    
    if (enabled && !this.syncInterval) {
      this.syncInterval = window.setInterval(() => {
        this.syncEvents();
      }, 30000);
    } else if (!enabled && this.syncInterval) {
      window.clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  /**
   * Track an analytics event
   */
  trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId' | 'userId' | 'userRole'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userRole: this.userRole
    };
    
    this.events.push(fullEvent);
    console.log('Analytics event tracked:', fullEvent);
    
    // If we have too many events in memory (>100), sync them
    if (this.persistenceEnabled && this.events.length > 100) {
      this.syncEvents();
    }
  }
  
  /**
   * Sync events to mock storage for now 
   * In a real app this would use supabase
   */
  private async syncEvents() {
    if (!this.persistenceEnabled || this.events.length === 0) return;
    
    // Clone events to avoid race conditions
    const eventsToSync = [...this.events];
    
    try {
      startTiming('analytics-sync');
      
      // In a real app, we would use Supabase here
      // For now, we'll just add to our mock data
      eventsToSync.forEach(event => {
        mockHistoricalData.push(event);
      });
      
      // Remove synced events from the local store
      this.events = this.events.filter(
        event => !eventsToSync.includes(event)
      );
      
      const syncTime = endTiming('analytics-sync');
      console.log(`Synced ${eventsToSync.length} analytics events in ${syncTime?.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error syncing analytics events:', error);
    }
  }
  
  /**
   * Force sync all events immediately (useful before page unload)
   */
  private forceSyncEvents() {
    if (navigator.sendBeacon && this.persistenceEnabled) {
      const eventsToSync = [...this.events];
      
      if (eventsToSync.length === 0) return;
      
      // In a real app with a working backend, we would send via beacon API
      // For now, just add to mock data
      eventsToSync.forEach(event => {
        mockHistoricalData.push(event);
      });
      
      // Clear local events
      this.events = [];
    } else {
      // Fallback to regular sync
      this.syncEvents();
    }
  }
  
  // Track page view with timing
  trackPageView(pageName: string) {
    startTiming(`page-view-${pageName}`);
    this.pageViewTimes[pageName] = Date.now();
    
    this.trackEvent({
      category: 'Page',
      subcategory: 'View',
      action: 'View',
      label: pageName
    });
    
    return () => {
      if (this.pageViewTimes[pageName]) {
        const duration = Date.now() - this.pageViewTimes[pageName];
        this.trackEvent({
          category: 'Page',
          subcategory: 'Duration',
          action: 'Duration',
          label: pageName,
          value: Math.floor(duration / 1000)
        });
        endTiming(`page-view-${pageName}`);
        delete this.pageViewTimes[pageName];
      }
    };
  }
  
  // Track user interactions with more granular categorization
  trackInteraction(component: string, action: string, subcategory: EventSubcategory = 'Click', metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Interaction',
      subcategory,
      action: action,
      label: component,
      metadata
    });
  }
  
  // Track document-related events
  trackDocumentEvent(action: string, documentId: string, subcategory: EventSubcategory = 'View', metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Document',
      subcategory,
      action,
      label: documentId,
      metadata
    });
  }
  
  // Track client-related events
  trackClientEvent(action: string, clientId: string, subcategory: EventSubcategory = 'View', metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Client',
      subcategory,
      action,
      label: clientId,
      metadata
    });
  }
  
  // Track errors
  trackError(errorType: string, message: string, metadata?: Record<string, any>) {
    this.trackEvent({
      category: 'Error',
      subcategory: 'Error',
      action: errorType,
      label: message,
      metadata
    });
  }
  
  // Get analytics data for dashboards (in-memory data)
  getAnalyticsData(category?: EventCategory, timeRange: number = 7 * 24 * 60 * 60 * 1000) {
    const cutoffTime = Date.now() - timeRange;
    let filteredEvents = this.events.filter(event => event.timestamp >= cutoffTime);
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    return filteredEvents;
  }
  
  // Get historical analytics data (mock data)
  async getHistoricalData(options: {
    category?: EventCategory;
    subcategory?: EventSubcategory;
    startDate?: Date;
    endDate?: Date;
    userRole?: string;
    limit?: number;
  } = {}): Promise<AnalyticsEvent[]> {
    try {
      startTiming('fetch-historical-analytics');
      
      // Filter the mock data based on options
      let filteredData = [...mockHistoricalData];
      
      // Apply filters
      if (options.category) {
        filteredData = filteredData.filter(event => event.category === options.category);
      }
      
      if (options.subcategory) {
        filteredData = filteredData.filter(event => event.subcategory === options.subcategory);
      }
      
      if (options.startDate) {
        const startTime = options.startDate.getTime();
        filteredData = filteredData.filter(event => event.timestamp >= startTime);
      }
      
      if (options.endDate) {
        const endTime = options.endDate.getTime();
        filteredData = filteredData.filter(event => event.timestamp <= endTime);
      }
      
      if (options.userRole) {
        filteredData = filteredData.filter(event => event.userRole === options.userRole);
      }
      
      // Apply limit
      if (options.limit && filteredData.length > options.limit) {
        filteredData = filteredData.slice(0, options.limit);
      }
      
      // Sort by timestamp (most recent first)
      filteredData.sort((a, b) => b.timestamp - a.timestamp);
      
      endTiming('fetch-historical-analytics');
      
      return filteredData;
    } catch (error) {
      console.error('Error in getHistoricalData:', error);
      return [];
    }
  }
  
  // Get event trend data (grouped by day, week, or month)
  async getEventTrends(period: 'day' | 'week' | 'month' = 'day', options: {
    category?: EventCategory;
    subcategory?: EventSubcategory;
    startDate?: Date;
    endDate?: Date;
    userRole?: string;
  } = {}): Promise<EventTrend[]> {
    try {
      const historicalData = await this.getHistoricalData(options);
      
      // Group by the selected period
      const trends: Record<string, { count: number; category: string; subcategory?: string }> = {};
      
      historicalData.forEach(event => {
        const date = new Date(event.timestamp);
        let periodKey: string;
        
        switch (period) {
          case 'day':
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            break;
          case 'week':
            // Get the first day of the week (Sunday)
            const firstDayOfWeek = new Date(date);
            const day = date.getDay();
            const diff = date.getDate() - day;
            firstDayOfWeek.setDate(diff);
            periodKey = `${firstDayOfWeek.getFullYear()}-W${Math.ceil((firstDayOfWeek.getDate() + 1 + firstDayOfWeek.getDay()) / 7)}`;
            break;
          case 'month':
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          default:
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
        
        const key = `${periodKey}_${event.category}_${event.subcategory || ''}`;
        
        if (!trends[key]) {
          trends[key] = {
            count: 0,
            category: event.category,
            subcategory: event.subcategory
          };
        }
        
        trends[key].count += 1;
      });
      
      // Convert to array format
      return Object.entries(trends).map(([key, value]) => {
        const [periodKey] = key.split('_');
        return {
          period: periodKey,
          count: value.count,
          category: value.category,
          subcategory: value.subcategory
        };
      });
    } catch (error) {
      console.error('Error in getEventTrends:', error);
      return [];
    }
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
  
  // Get event breakdown by category
  getEventsByCategory() {
    const categoryCounts: Record<string, number> = {};
    
    this.events.forEach(event => {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      count
    }));
  }
  
  // Get event breakdown by subcategory
  getEventsBySubcategory() {
    const subcategoryCounts: Record<string, number> = {};
    
    this.events.forEach(event => {
      if (event.subcategory) {
        subcategoryCounts[event.subcategory] = (subcategoryCounts[event.subcategory] || 0) + 1;
      }
    });
    
    return Object.entries(subcategoryCounts).map(([subcategory, count]) => ({
      name: subcategory,
      count
    }));
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
