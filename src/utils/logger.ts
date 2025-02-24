
/**
 * Browser-compatible logger utility that provides different log levels
 * and formatting options for development and production environments.
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level}]: ${message}`;
  }

  info(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('INFO', message);
    console.info(formattedMessage, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('DEBUG', message);
      console.debug(formattedMessage, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('ERROR', message);
    console.error(formattedMessage, ...args);
    
    // In production, you might want to send errors to an error tracking service
    if (!this.isDevelopment) {
      // Example: send to error tracking service
      // errorTrackingService.captureError(message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('WARN', message);
    console.warn(formattedMessage, ...args);
  }
}

const logger = new Logger();
export default logger;
