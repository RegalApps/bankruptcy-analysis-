import { UploadMetric } from './types';

class UploadAnalytics {
  private metrics: UploadMetric[] = [];
  private readonly MAX_METRICS = 100;

  logMetric(metric: UploadMetric) {
    this.metrics.push(metric);
    
    // Keep only the last 100 metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }

  getAnalytics() {
    if (this.metrics.length === 0) {
      return {
        totalUploads: 0,
        successRate: 0,
        averageDuration: 0,
        byFileType: {},
        recent: []
      };
    }

    const successful = this.metrics.filter(m => m.success);
    const averageDuration = successful.reduce((sum, m) => sum + m.duration, 0) / (successful.length || 1);

    // Group by file type
    const byFileType: Record<string, { count: number, successCount: number, averageDuration: number }> = {};
    
    this.metrics.forEach(metric => {
      if (!byFileType[metric.fileType]) {
        byFileType[metric.fileType] = { count: 0, successCount: 0, averageDuration: 0 };
      }
      
      byFileType[metric.fileType].count++;
      
      if (metric.success) {
        byFileType[metric.fileType].successCount++;
        const current = byFileType[metric.fileType];
        current.averageDuration = 
          (current.averageDuration * (current.successCount - 1) + metric.duration) / current.successCount;
      }
    });

    return {
      totalUploads: this.metrics.length,
      successRate: successful.length / this.metrics.length,
      averageDuration,
      byFileType,
      recent: this.metrics.slice(-10) // Last 10 uploads
    };
  }

  getTrendData() {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    const recentUploads = this.metrics.filter(
      m => m.timestamp >= oneDayAgo && m.success
    );
    
    const hourlyData: Record<number, { count: number, totalSize: number, timestamp: number }> = {};
    
    recentUploads.forEach(upload => {
      const hour = Math.floor((upload.timestamp - oneDayAgo) / (60 * 60 * 1000));
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          count: 0,
          totalSize: 0,
          timestamp: oneDayAgo + hour * 60 * 60 * 1000
        };
      }
      
      hourlyData[hour].count++;
      hourlyData[hour].totalSize += upload.fileSize;
    });
    
    return Object.values(hourlyData).sort((a, b) => a.timestamp - b.timestamp);
  }
}

export const uploadAnalytics = new UploadAnalytics();
