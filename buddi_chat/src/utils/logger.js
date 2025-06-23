
const logLevels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = process.env.NODE_ENV === 'development' 
  ? logLevels.DEBUG 
  : logLevels.ERROR;

const logger = {
  debug: (...args) => log(logLevels.DEBUG, 'DEBUG', ...args),
  info: (...args) => log(logLevels.INFO, 'INFO', ...args),
  warn: (...args) => log(logLevels.WARN, 'WARN', ...args),
  error: (...args) => log(logLevels.ERROR, 'ERROR', ...args),
  apiError: (...args) => log(logLevels.ERROR, 'API_ERROR', ...args),
};

function log(level, prefix, ...args) {
  if (level >= currentLevel) {
    const timestamp = new Date().toISOString();
    const message = [`[${timestamp}] ${prefix}:`, ...args];
    
    switch (level) {
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
        break;
    }
  }
}

export default logger;