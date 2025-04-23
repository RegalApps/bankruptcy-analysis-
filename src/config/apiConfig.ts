/**
 * API Configuration
 * 
 * This file contains configuration for all API endpoints used in the application.
 * Centralizing these configurations makes it easier to switch between environments.
 */

// Get the current host and port from the window location
const getCurrentHost = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:8080'; // Default fallback
};

// Configuration for the bankruptcy analyzer API
export const BANKRUPTCY_ANALYZER_API = {
  // API endpoints
  endpoints: {
    analyze: '/api/analyze',
    status: '/api/status',
  },
  
  // Timeout in milliseconds
  timeout: 30000,
};

// Export a function to get the full URL for a bankruptcy analyzer endpoint
export const getBankruptcyAnalyzerUrl = (endpoint: keyof typeof BANKRUPTCY_ANALYZER_API.endpoints): string => {
  // Always use the current host
  const currentHost = getCurrentHost();
  return `${currentHost}${BANKRUPTCY_ANALYZER_API.endpoints[endpoint]}`;
};
