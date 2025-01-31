const logLevels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };
  
  const currentLevel = import.meta.env.DEV ? logLevels.DEBUG : logLevels.ERROR;
  
  const logger = {
    debug: (...args) => log(logLevels.DEBUG, 'DEBUG', ...args),
    info: (...args) => log(logLevels.INFO, 'INFO', ...args),
    warn: (...args) => log(logLevels.WARN, 'WARN', ...args),
    error: (...args) => log(logLevels.ERROR, 'ERROR', ...args),
    
    // For API error responses
    apiError: (error) => {
      const message = error.response?.data?.message || error.message;
      const code = error.response?.data?.code || 'UNKNOWN_ERROR';
      console.error(`API Error [${code}]:`, message);
      sendToErrorTrackingService(error);
    }
  };
  
  function log(level, prefix, ...args) {
    if (level >= currentLevel) {
      const timestamp = new Date().toISOString();
      const message = [`[${timestamp}] ${prefix}:`, ...args];
      
      switch(level) {
        case logLevels.DEBUG:
          console.debug(...message);
          break;
        case logLevels.INFO:
          console.info(...message);
          break;
        case logLevels.WARN:
          console.warn(...message);
          break;
        case logLevels.ERROR:
          console.error(...message);
          sendToErrorTrackingService({ message: args.join(' ') });
          break;
      }
    }
  }
  
  // Optional error tracking service integration
  function sendToErrorTrackingService(error) {
    if (!import.meta.env.DEV) {
      // Example: Send to Sentry/LogRocket/etc
      // window.trackingService?.captureException(error);
    }
  }
  
  export default logger;