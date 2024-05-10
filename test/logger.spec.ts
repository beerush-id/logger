import { createLogger } from '../dist/index.js';
import { fileAdapter } from '../src/adapters/file/index.js';
import { LogLevel } from '../src/index.js';

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
  .info('Server started', { extra: 'extra' });
