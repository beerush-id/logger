# Console Adapter

The console adapter logs the data to the console. The console adapter is useful when you want to log the data to the
console. The console adapter is a built-in adapter that comes with the logger module.

## Usage

You can use the console adapter as shown below:

```typescript
import { LogLevel } from '@beerush/logger';
import { consoleAdapter } from '@beerush/logger/adapters/console';
import { logger } from './logger.ts';

logger.use(consoleAdapter({ level: LogLevel.DEBUG }));

logger.info('Hello, World!'); // This will log the message to the console.
logger.verbose('Hello, World!'); // This will not log the message to the console.
```

### Options

- **level** *optional*: The log level. The default value is `LogLevel.VERBOSE`.
- **trace** *optional*: Whether to include the stack trace in the log. The default value is `false`.
- **timestamp** *optional*: Whether to include the timestamp in the log. The default value is `true`.
