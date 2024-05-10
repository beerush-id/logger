# File Adapter

The file adapter logs the data to a file. The file adapter is useful when you want to log the data to a file instead of
the console. The file adapter is a built-in adapter that comes with the logger module.

> **Note**: The file adapter is only available in environment where the **`node:fs/promises`** file system is available.
> For example, you
> can use the file adapter in **Node.js** but not in the browser.

## Usage

You can use the file adapter as shown below:

```typescript
import { LogLevel } from '@beerush/logger';
import { fileAdapter } from '@beerush/logger/adapters/file';
import { logger } from './logger.ts';

logger.use(fileAdapter({ location: './logs', level: LogLevel.ERROR }));

logger.warn('This is a warning message.'); // This will not log the message to the file.
logger.error('This is an error message.'); // This will log the message to the file.
```

### Options

- **location** *optional*: The location where the log file will be stored. The default value is `./logs`.
- **level** *optional*: The log level. The default value is `LogLevel.WARN`.
- **filename** *optional*: The name of the log file. The default value is `%y-%m-%d.log`.

> **Note**: By default, the file adapter creates a new log file every day. The log file name is in the
> format `YYYY-MM-DD.log`. To change the log file name, you can use the following placeholders:
> - `%y`: Year
> - `%m`: Month
> - `%d`: Day
