type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    const entry = formatLog('info', message, context);
    console.log(`[INFO] ${entry.timestamp} - ${entry.message}`, context || '');
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry = formatLog('warn', message, context);
    console.warn(`[WARN] ${entry.timestamp} - ${entry.message}`, context || '');
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const entry = formatLog('error', message, {
      ...context,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    });
    console.error(`[ERROR] ${entry.timestamp} - ${entry.message}`, entry.context);
  },

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      const entry = formatLog('debug', message, context);
      console.debug(`[DEBUG] ${entry.timestamp} - ${entry.message}`, context || '');
    }
  },
};
