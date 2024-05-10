import { type BrowserClient, type EventHint } from '@sentry/browser';
import { type Log, LogLevel } from '../../index.js';
import { createMessage } from '../console/index.js';

export type SentryConfig = {
  client: unknown;
  level?: LogLevel;
};

const severityMap: {
  [K in LogLevel]?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
} = {
  [LogLevel.ERROR]: 'error',
  [LogLevel.WARN]: 'warning',
  [LogLevel.INFO]: 'info',
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.VERBOSE]: 'log',
};

export function sentryAdapter(config: SentryConfig) {
  const { client, level = LogLevel.WARN } = config as { client: BrowserClient; level: LogLevel };

  return {
    name: '@beerush/sentry',
    emit: (log: Log) => {
      if (level < log.level || !severityMap[log.level]) return;

      const message = createMessage(log);
      const hint: EventHint = {
        integrations: ['@beerush/logger'],
      };

      if (log.extra) {
        hint.data = log.extra;
      }

      if (log.error) {
        hint.syntheticException = log.error;
      }

      if (log.level === LogLevel.ERROR) {
        client.captureException(message, hint);
      } else {
        client.captureMessage(message, severityMap[log.level], hint);
      }
    },
  };
}
