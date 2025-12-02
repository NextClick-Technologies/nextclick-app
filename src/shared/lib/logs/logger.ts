// Logger works on both client and server
// On client, it falls back to console methods
const isProduction = process.env.NODE_ENV === 'production';
const isServer = typeof window === 'undefined';

// Only use pino on server-side
let pino: any;

if (isServer) {
  try {
    // @ts-ignore - Use eval to prevent Turbopack from analyzing pino at build time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    pino = eval('require')("pino");
  } catch (e) {
    console.warn('Failed to load pino, falling back to console');
  }
}

// Create logger instance
const createLogger = () => {
  if (isServer && pino) {
    // Server-side: use pino
    return pino({
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      redact: {
        paths: [
          'password',
          'token',
          'secret',
          'authorization',
          'cookie',
          'user.password',
          'user.token',
        ],
        remove: true,
      },
      formatters: {
        level: (label: string) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  } else {
    // Client-side: use console with pino-like interface
    return {
      info: (...args: any[]) => console.info('[INFO]', ...args),
      warn: (...args: any[]) => console.warn('[WARN]', ...args),
      error: (...args: any[]) => console.error('[ERROR]', ...args),
      debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
      trace: (...args: any[]) => console.trace('[TRACE]', ...args),
      fatal: (...args: any[]) => console.error('[FATAL]', ...args),
    };
  }
};

export const logger = createLogger();
