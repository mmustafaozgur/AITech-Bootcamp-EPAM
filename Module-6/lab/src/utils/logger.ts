/**
 * Structured JSON logger utility.
 * Provides log(level, event, meta) and convenience methods.
 */
export function log(level: string, event: string, meta: Record<string, unknown> = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...meta
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (event: string, meta?: Record<string, unknown>) => log('info', event, meta),
  warn: (event: string, meta?: Record<string, unknown>) => log('warn', event, meta),
  error: (event: string, meta?: Record<string, unknown>) => log('error', event, meta)
};
