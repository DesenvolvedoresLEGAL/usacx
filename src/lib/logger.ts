/**
 * Production-safe logger utility
 * Only logs in development mode to prevent sensitive data exposure
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isDevelopment = import.meta.env.DEV;

const formatMessage = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

export const logger = {
  debug: (message: string, context?: LogContext): void => {
    if (isDevelopment) {
      console.debug(formatMessage('debug', message, context));
    }
  },

  info: (message: string, context?: LogContext): void => {
    if (isDevelopment) {
      console.info(formatMessage('info', message, context));
    }
  },

  warn: (message: string, context?: LogContext): void => {
    if (isDevelopment) {
      console.warn(formatMessage('warn', message, context));
    }
  },

  error: (message: string, context?: LogContext): void => {
    // Errors are always logged (but could be sent to error tracking service in production)
    if (isDevelopment) {
      console.error(formatMessage('error', message, context));
    }
    // In production, you could send to Sentry, LogRocket, etc.
    // if (!isDevelopment) {
    //   sendToErrorTracking(message, context);
    // }
  },

  // For backward compatibility during migration
  log: (message: string, context?: LogContext): void => {
    if (isDevelopment) {
      console.log(formatMessage('info', message, context));
    }
  },
};

export default logger;
