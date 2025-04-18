
import { UploadInfo } from './types';

class UploadStore {
  private activeUploads = new Map<string, UploadInfo>();

  set(id: string, info: UploadInfo) {
    this.activeUploads.set(id, info);
  }

  get(id: string) {
    return this.activeUploads.get(id);
  }

  delete(id: string) {
    this.activeUploads.delete(id);
  }

  getAll() {
    return Array.from(this.activeUploads.entries()).map(([id, info]) => ({
      id,
      progress: info.progress,
      stage: info.stage,
    }));
  }
}

export const uploadStore = new UploadStore();
