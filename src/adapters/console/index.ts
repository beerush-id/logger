import { type Log, type LogAdapter, LogLevel } from '../../index.js';

export type ConsoleConfig = {
  level?: LogLevel;
  trace?: boolean;
  timestamp?: boolean;
};

export function consoleAdapter(config?: ConsoleConfig): LogAdapter {
  const { level = LogLevel.VERBOSE, trace = false, timestamp = true } = config ?? {};

  const emitter: {
    [K in LogLevel]?: (...args: unknown[]) => void;
  } = {
    [LogLevel.VERBOSE]: (...args: unknown[]) => {
      (trace ? console.trace : console.debug)(
        ...args.map((arg, i) => {
          if (typeof arg === 'string') {
            return i === 0 ? `📜 ${verboseColor(arg)}` : arg;
          }

          return arg;
        })
      );
    },
    [LogLevel.DEBUG]: (...args: unknown[]) => {
      (trace ? console.trace : console.debug)(
        ...args.map((arg, i) => {
          if (typeof arg === 'string') {
            return i === 0 ? `🐞 ${debugColor(arg)}` : arg;
          }

          return arg;
        })
      );
    },
    [LogLevel.INFO]: (...args: unknown[]) => {
      console.log(
        ...args.map((arg, i) => {
          if (typeof arg === 'string') {
            return i === 0 ? `ℹ️ ${infoColor(arg)}` : arg;
          }

          return arg;
        })
      );
    },
    [LogLevel.WARN]: (...args: unknown[]) => {
      console.warn(
        ...args.map((arg, i) => {
          if (typeof arg === 'string') {
            return i === 0 ? `⚠️ ${warnColor(arg)}` : arg;
          }

          return arg;
        })
      );
    },
    [LogLevel.ERROR]: (...args: unknown[]) => {
      console.error(
        ...args.map((arg, i) => {
          if (typeof arg === 'string') {
            return i === 0 ? `❌ ${errorColor(arg)}` : arg;
          }

          return arg;
        })
      );
    },
  };

  return {
    name: '@beerush/console',
    emit: (log: Log) => {
      if (level < log.level) return;

      if (typeof emitter[log.level] === 'function') {
        const args: unknown[] = [];

        if (typeof log.message === 'string') {
          args.push(createMessage(log, timestamp));
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

export function createMessage(log: Log, timestamp?: boolean, stack?: boolean): string {
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
