import "server-only";

const isProduction = process.env.NODE_ENV === 'production';

// @ts-ignore - Use eval to prevent Turbopack from analyzing pino at build time
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = eval('require')("pino");

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  // No transport - outputs JSON which you can pipe to pino-pretty externally
  // Run: npm run dev 2>&1 | npx pino-pretty
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
