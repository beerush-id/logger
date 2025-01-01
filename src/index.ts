import { consoleAdapter } from './adapters/console/index.js';
import { type Log, type LogAdapter, type Logger, type LoggerConfig, LogLevel, type User } from './logger.js';

export function createLogger<T>(config?: LoggerConfig, adapters = new Map<string, LogAdapter>()): Logger<T> {
  const { tags = [] } = config ?? ({} as LoggerConfig);
  const links = new Set<Logger<unknown>>();
  let currentUser: User | undefined;

  return {
    use(adapter: LogAdapter) {
      adapters.set(adapter.name, adapter);

      for (const logger of links) {
        logger.use(adapter);
      }

      return this;
    },
    create<T>(cfg?: LoggerConfig): Logger<T> {
      const mainTags = config?.tags ?? [];
      const subTags = cfg?.tags ?? [];
      return createLogger({ ...config, ...cfg, tags: [...mainTags, ...subTags] }, adapters);
    },
    link(logger: Logger<unknown>) {
      links.add(logger);

      for (const [, adapter] of adapters.entries()) {
        logger.use(adapter);
      }

      return this;
    },
    sign(user: User) {
      currentUser = user;

      for (const logger of links) {
        logger.sign(user);
      }
    },
    log(log: Log) {
      const nextTags = log.tags ?? [];

      if (tags?.length) {
        nextTags.unshift(...tags);
      }

      if (!adapters.size) {
        this.use(consoleAdapter({ level: LogLevel.VERBOSE }));
      }

      for (const [, adapter] of adapters.entries()) {
        adapter.emit?.({ ...log, tags: nextTags, user: currentUser });
      }

      return this;
    },
    verbose(message: string, ...extra: unknown[]) {
      this.log({ level: LogLevel.VERBOSE, message, timestamp: new Date(), extra });
      return this;
    },
    debug(message: string, ...extra: unknown[]) {
      this.log({ level: LogLevel.DEBUG, message, timestamp: new Date(), extra });
      return this;
    },
    info(message: string, ...extra: unknown[]) {
      this.log({ level: LogLevel.INFO, message, timestamp: new Date(), extra });
      return this;
    },
    warn(message: string, ...extra: unknown[]) {
      this.log({ level: LogLevel.WARN, message, timestamp: new Date(), extra });
      return this;
    },
    error<E extends Error = Error>(message: string | E, error?: E, ...extra: unknown[]) {
      if (typeof message !== 'string') {
        message = error?.message ?? 'An error occurred.';
      }

      this.log({ level: LogLevel.ERROR, message, timestamp: new Date(), error, extra });
      return this;
    },
    track<E extends T = T>(message: string, extra?: E) {
      this.log({ level: LogLevel.TRACKER, message, timestamp: new Date(), extra });
      return this;
    },
  };
}

export const logger = createLogger();
logger.use(consoleAdapter({ level: LogLevel.VERBOSE }));

export * from './logger.js';
