
import { ProgressCallback } from './types';

class UploadCallbackManager {
  private callbacks: ProgressCallback[] = [];

  add(callback: ProgressCallback) {
    this.callbacks.push(callback);
    return () => this.remove(callback);
  }

  remove(callback: ProgressCallback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  notify(id: string, progress: number, stage: string) {
    this.callbacks.forEach(cb => cb(id, progress, stage));
  }
}

export const uploadCallbacks = new UploadCallbackManager();
