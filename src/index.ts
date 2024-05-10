import { consoleAdapter } from './adapters/console/index.js';

export enum LogLevel {
  OFF = -1,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  VERBOSE,
  TRACKER,
}

export type User =
  | {
      id?: string;
      name?: string;
      email?: string;
    }
  | Record<string, unknown>;

export type Log<E extends Error = Error> = {
  level: LogLevel;
  message: string;
  timestamp: Date;
  user?: User;
  tags?: string[];
  extra?: unknown;
  error?: E;
};

export type LoggerConfig = {
  tags?: string[];
};

export type LogEmitter = (log: Log) => void | Promise<void>;
export type LogAdapter = {
  name: string;
  emit: LogEmitter;
};

export type Logger<T> = {
  /**
   * Log a message with the INFO level.
   * @param {string} message
   * @param extra
   * @returns {Logger<T>}
   */
  info(message: string, ...extra: unknown[]): Logger<T>;
  /**
   * Log a message with the WARN level.
   * @param {string} message
   * @param extra
   * @returns {Logger<T>}
   */
  warn(message: string, ...extra: unknown[]): Logger<T>;
  /**
   * Log a message with the ERROR level.
   * @param {string} message
   * @param {E} error
   * @param extra
   * @returns {Logger<T>}
   */
  error<E extends Error = Error>(message: string, error?: E, ...extra: unknown[]): Logger<T>;
  /**
   * Log a message with the DEBUG level.
   * @param {string} message
   * @param extra
   * @returns {Logger<T>}
   */
  debug(message: string, ...extra: unknown[]): Logger<T>;
  /**
   * Log a message with the VERBOSE level.
   * @param {string} message
   * @param extra
   * @returns {Logger<T>}
   */
  verbose(message: string, ...extra: unknown[]): Logger<T>;
  /**
   * Log a custom log object.
   * @param {Logger} log
   * @returns {Logger<T>}
   */
  log(log: Log): Logger<T>;
  /**
   * Log a message with the TRACKER level.
   * @param {string} message
   * @param extra
   * @returns {Logger<T>}
   */
  track<E extends T = T>(message: string, extra?: E): Logger<T>;
  /**
   * Create a new child logger instance. It will inherit the parent's configuration.
   * @param {LoggerConfig} config
   * @returns {Logger<C>}
   */
  create<C>(config?: LoggerConfig): Logger<C>;
  /**
   * Link a logger instance to the current one. It will override the linked logger's adapters.
   * @param {Logger<unknown>} logger
   * @returns {Logger<T>}
   */
  link(logger: Logger<unknown>): Logger<T>;
  /**
   * Sign the logger with a user object. It will be attached to all logs, and shared with linked loggers.
   * @param {User} user
   */
  sign(user: User): void;
  /**
   * Use a log adapter to emit logs.
   * @param {LogAdapter} adapter
   * @returns {Logger<T>}
   */
  use(adapter: LogAdapter): Logger<T>;
};

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
    error<E extends Error = Error>(message: string, error?: E, ...extra: unknown[]) {
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
