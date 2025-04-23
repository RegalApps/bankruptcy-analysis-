/**
 * Folder Service - Disabled Version
 * 
 * This service has been disabled as part of application simplification.
 * All methods return empty or mock data to prevent errors in components
 * that may still reference them.
 */

import logger from '@/utils/logger';

// Type definitions for compatibility
export interface Folder {
  id: string;
  name: string;
  parent_id?: string | null;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

// Simplified service with no-op functions
class FolderService {
  // Return empty folders array
  getFolders() {
    logger.debug('Folder service disabled - returning empty folders array');
    return Promise.resolve([]);
  }
  
  // Return a mock folder
  getFolder(id: string) {
    logger.debug(`Folder service disabled - would get folder with ID: ${id}`);
    return Promise.resolve(null);
  }
  
  // No-op create function
  createFolder(folderData: Partial<Folder>) {
    logger.debug('Folder service disabled - would create folder:', folderData.name);
    return Promise.resolve({
      id: 'mock-folder-id',
      name: folderData.name || 'Mock Folder',
      created_at: new Date().toISOString(),
      parent_id: folderData.parent_id || null
    } as Folder);
  }
  
  // No-op update function
  updateFolder(id: string, folderData: Partial<Folder>) {
    logger.debug(`Folder service disabled - would update folder with ID: ${id}`);
    return Promise.resolve(true);
  }
  
  // No-op delete function
  deleteFolder(id: string) {
    logger.debug(`Folder service disabled - would delete folder with ID: ${id}`);
    return Promise.resolve(true);
  }
}

// Export singleton instance
export const folderService = new FolderService();
export default folderService;
