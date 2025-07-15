// Client-side logging utility for Next.js app

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  url?: string;
  userAgent?: string;
  additional?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  private createLogEntry(level: LogEntry['level'], message: string, additional?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      additional
    };
  }

  private logToConsole(entry: LogEntry): void {
    const logMethod = entry.level === 'error' ? console.error : 
                     entry.level === 'warn' ? console.warn : 
                     entry.level === 'debug' ? console.debug : 
                     console.log;
    
    logMethod(`[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, entry.additional || '');
  }

  private async logToRemote(entry: LogEntry): Promise<void> {
    // In production, you could send logs to a service like CloudWatch, Datadog, etc.
    // For now, we'll just log to console in development
    if (this.isDevelopment) {
      this.logToConsole(entry);
      return;
    }

    try {
      // Example: Send to CloudWatch Logs or external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
      
      // For now, just log to console
      this.logToConsole(entry);
    } catch (error) {
      console.error('Failed to send log to remote service:', error);
      this.logToConsole(entry);
    }
  }

  public info(message: string, additional?: Record<string, any>): void {
    const entry = this.createLogEntry('info', message, additional);
    void this.logToRemote(entry);
  }

  public warn(message: string, additional?: Record<string, any>): void {
    const entry = this.createLogEntry('warn', message, additional);
    void this.logToRemote(entry);
  }

  public error(message: string, additional?: Record<string, any>): void {
    const entry = this.createLogEntry('error', message, additional);
    void this.logToRemote(entry);
  }

  public debug(message: string, additional?: Record<string, any>): void {
    const entry = this.createLogEntry('debug', message, additional);
    void this.logToRemote(entry);
  }

  // Log API calls
  public apiCall(method: string, url: string, status: number, duration: number): void {
    this.info(`API Call: ${method} ${url}`, {
      method,
      url,
      status,
      duration,
      success: status >= 200 && status < 300
    });
  }

  // Log user interactions
  public userAction(action: string, details?: Record<string, any>): void {
    this.info(`User Action: ${action}`, details);
  }

  // Log application errors
  public appError(error: Error, context?: string): void {
    this.error(`Application Error${context ? ` in ${context}` : ''}`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    });
  }
}

export const logger = new Logger();
export default logger; 