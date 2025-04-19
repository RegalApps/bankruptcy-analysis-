
import { create } from "zustand";

type UploadStatus = "uploading" | "processing" | "complete" | "error";

interface UploadInfo {
  id: string;
  progress: number;
  status: UploadStatus;
  message: string;
  startTime: Date;
  metadata?: any;
}

interface UploadTracker {
  uploads: Record<string, UploadInfo>;
  addUpload: (id: string, progress: number, metadata?: any) => void;
  updateUpload: (id: string, progress: number, message: string) => void;
  setUploadStatus: (id: string, status: UploadStatus, message?: string) => void;
  completeUpload: (id: string, message?: string) => void;
  setError: (id: string, message: string) => void;
  removeUpload: (id: string) => void;
}

const useUploadStore = create<UploadTracker>((set) => ({
  uploads: {},
  
  addUpload: (id, progress, metadata) => set((state) => ({
    uploads: {
      ...state.uploads,
      [id]: {
        id,
        progress,
        status: "uploading",
        message: "Starting upload...",
        startTime: new Date(),
        metadata
      }
    }
  })),
  
  updateUpload: (id, progress, message) => set((state) => {
    if (!state.uploads[id]) return state;
    
    return {
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],
          progress,
          message
        }
      }
    };
  }),
  
  setUploadStatus: (id, status, message) => set((state) => {
    if (!state.uploads[id]) return state;
    
    return {
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],
          status,
          message: message || state.uploads[id].message
        }
      }
    };
  }),
  
  completeUpload: (id, message) => set((state) => {
    if (!state.uploads[id]) return state;
    
    return {
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],
          progress: 100,
          status: "complete",
          message: message || "Upload complete"
        }
      }
    };
  }),
  
  setError: (id, message) => set((state) => {
    if (!state.uploads[id]) return state;
    
    return {
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],
          status: "error",
          message
        }
      }
    };
  }),
  
  removeUpload: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.uploads;
    return { uploads: rest };
  })
}));

// Type for callbacks
type ProgressCallback = (id: string, progress: number, message: string) => void;

// Array to store callbacks
const progressCallbacks: ProgressCallback[] = [];

// Function to add a callback
export const addUploadProgressCallback = (callback: ProgressCallback) => {
  progressCallbacks.push(callback);
  
  // Return a function to remove the callback
  return () => {
    const index = progressCallbacks.indexOf(callback);
    if (index !== -1) {
      progressCallbacks.splice(index, 1);
    }
  };
};

// Helper function to track uploads
export const trackUpload = (id: string, initialProgress: number = 0, metadata?: any) => {
  const store = useUploadStore.getState();
  store.addUpload(id, initialProgress, metadata);
  
  return {
    updateProgress: (progress: number, message: string) => {
      store.updateUpload(id, progress, message);
      // Notify all callbacks
      progressCallbacks.forEach(callback => callback(id, progress, message));
    },
    
    setProcessing: (message: string) => {
      store.setUploadStatus(id, "processing", message);
      // Notify all callbacks
      progressCallbacks.forEach(callback => callback(id, -1, message));
    },
    
    completeUpload: (message?: string) => {
      store.completeUpload(id, message);
      // Notify all callbacks
      progressCallbacks.forEach(callback => callback(id, 100, message || "Upload complete"));
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        store.removeUpload(id);
      }, 5000);
    },
    
    setError: (message: string) => {
      store.setError(id, message);
      // Notify all callbacks
      progressCallbacks.forEach(callback => callback(id, -1, `Error: ${message}`));
    }
  };
};

// Add missing functions that are referenced in other components
export const getActiveUploads = () => {
  const store = useUploadStore.getState();
  return Object.entries(store.uploads).map(([id, info]) => ({
    documentId: id,
    id,
    progress: info.progress,
    message: info.message,
    status: info.status
  }));
};

// Mock functions for analytics that we plan to remove
export const getUploadAnalytics = () => {
  return {
    totalUploads: 0,
    successRate: 0,
    averageDuration: 0,
    byFileType: {},
    recent: []
  };
};

export const getUploadSpeedTrend = () => {
  return [];
};

export { useUploadStore };
