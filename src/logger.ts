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
  timing?: number;
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
  error<E extends Error = Error>(message: string | E, error?: E, ...extra: unknown[]): Logger<T>;
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
   * Log a message with the DEBUG level and a timing information.
   * @param {string} message
   * @param extra
   * @returns {() => void}
   */
  timing(message: string, ...extra: unknown[]): (...extras: unknown[]) => number;
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
