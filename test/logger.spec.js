import { consoleAdapter } from '../dist/adapters/console/index.js';
import { fileAdapter } from '../dist/adapters/file/index.js';
import { createLogger } from '../dist/index.js';
import { LogLevel } from '../dist/logger.js';

const logger = createLogger();

logger.verbose('Server started');

const local = createLogger({ tags: ['SERVER'] });

local
  .verbose('Server started')
  .debug('Server started')
  .info('Server started')
  .warn('Server started')
  .error('Server error', new Error('Server error'))
  .log({ level: LogLevel.INFO, message: 'Server started', timestamp: new Date() });

local.info('Server started', 'extra', 'extra2');

const finishRequest = local.timing('Requesting data.');

setTimeout(() => {
  finishRequest();
}, Math.random() * 1000);

console.log('');

const socket = local.create({ tags: ['SOCKET'] });
socket
  .verbose('Socket connected')
  .debug('Socket connected')
  .info('Socket connected')
  .warn('Socket connected')
  .error('Socket error', new Error('Socket error'));

local.use(fileAdapter({ level: LogLevel.VERBOSE }));

local
  .verbose('Server started')
  .debug('Server started')
  .info('Server started')
  .warn('Server started')
  .error('Server error', new Error('Server error'))
  .error(new Error('Server error'))
  .info('Server started', { extra: 'extra' });

local.use(consoleAdapter({ format: (log) => `${new Date()} -> ${log.message}` }));

local
  .verbose('Server started')
  .debug('Server started')
  .info('Server started')
  .warn('Server started')
  .error('Server error', new Error('Server error'))
  .info('Server started', { extra: 'extra' });
