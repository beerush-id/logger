import { type Log, type LogAdapter, LogLevel } from '../../index.js';

export type ConsoleFormatter = (log: Log) => string;
export type ConsoleConfig = {
  level?: LogLevel;
  trace?: boolean;
  timestamp?: boolean;
  format?: ConsoleFormatter;
};

export function consoleAdapter(config?: ConsoleConfig): LogAdapter {
  const { level = LogLevel.VERBOSE, trace = false, timestamp = true, format = formatMessage } = config ?? {};

  const emitter: {
    [K in LogLevel]?: (...args: unknown[]) => void;
  } = {
    [LogLevel.VERBOSE]: (...args: unknown[]) => {
      (trace ? console.trace : console.debug)(...args);
    },
    [LogLevel.DEBUG]: (...args: unknown[]) => {
      (trace ? console.trace : console.debug)(...args);
    },
    [LogLevel.INFO]: console.log,
    [LogLevel.WARN]: console.warn,
    [LogLevel.ERROR]: console.error,
  };

  return {
    name: '@beerush/console',
    emit: (log: Log) => {
      if (level < log.level) return;

      if (typeof emitter[log.level] === 'function') {
        const args: unknown[] = [];

        if (typeof log.message === 'string') {
          args.push(typeof format === 'function' ? format(log, timestamp) : formatMessage(log, timestamp));
        } else {
          args.push(log.message);
        }

        if (log.error) {
          args.push(log.error);
        }

        if (log.extra) {
          if (Array.isArray(log.extra)) {
            args.push(...log.extra);
          } else {
            args.push(log.extra);
          }
        }

        emitter[log.level]?.(...args);
      }
    },
  };
}

export function formatMessage(log: Log, timestamp?: boolean, stack?: boolean, colorful = true): string {
  let message = ` ${log.message}`;

  if (timestamp) {
    message = `[${log.timestamp.toLocaleString()}]${message}`;
  }

  if (log.tags?.length) {
    message = `[${log.tags.join(':')}]${message}`;
  }

  if (stack && log.error instanceof Error) {
    message = `${message}\n${log.error.stack}`;
  }

  if (colorful) {
    switch (log.level) {
      case LogLevel.ERROR:
        message = `❌ ${errorColor(message)}`;
        break;
      case LogLevel.WARN:
        message = `⚠️ ${warnColor(message)}`;
        break;
      case LogLevel.INFO:
        message = `ℹ️ ${infoColor(message)}`;
        break;
      case LogLevel.DEBUG:
        message = `🐞 ${debugColor(message)}`;
        break;
      case LogLevel.VERBOSE:
        message = `📜 ${verboseColor(message)}`;
        break;
      default:
        message = `⚡ ${primaryColor(message)}`;
        break;
    }
  }

  return message.trim();
}

export function infoColor(message: string) {
  return `\x1b[32m${message}\x1b[0m`;
}

export function warnColor(message: string) {
  return `\x1b[33m${message}\x1b[0m`;
}

export function errorColor(message: string) {
  return `\x1b[31m${message}\x1b[0m`;
}

export function debugColor(message: string) {
  return `\x1b[34m${message}\x1b[0m`;
}

export function verboseColor(message: string) {
  return `\x1b[35m${message}\x1b[0m`;
}

export function primaryColor(message: string) {
  return `\x1b[36m${message}\x1b[0m`;
}
