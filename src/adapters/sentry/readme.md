# Sentry Adapter

The Sentry adapter is used to log messages to the [Sentry](https://sentry.io) service.

> **Note:** The Sentry adapter is available for environments that supported by the Sentry client. Error logs are
> captured as exception, and other logs are captured as messages.

## Usage

To use the Sentry adapter, you need to install and initialize the Sentry client. You can install the Sentry client using
the following command:

```bash
bun add @sentry/node # For NodeJS
```

```bash
bun add @sentry/browser # For Browser
```

### Sentry Browser

```typescript
import { type LogLevel } from '@beerush/logger';
import { logger } from './logger.ts';
import { sentryAdapter } from '@beerush/logger/adapters/sentry';
import * as Sentry from '@sentry/browser';

// Create sentry client and add it to the logger.
const client = Sentry.init({
  dsn: 'https://your-dsn-here',
});

logger.use(sentryAdapter({
  client,
  level: LogLevel.ERROR
}));

logger.info('Hello, World!'); // This will log the message to Sentry.
logger.error('Hello, World!'); // This will log the exception to Sentry.
```

### Sentry Node

```typescript
import { type LogLevel } from '@beerush/logger';
import { logger } from './logger.ts';
import { sentryAdapter } from '@beerush/logger/adapters/sentry';
import * as Sentry from '@sentry/node';

// Create sentry client and add it to the logger.
const client = Sentry.init({
  dsn: 'https://your-dsn-here',
});

logger.use(sentryAdapter({
  client,
  level: LogLevel.ERROR
}));

logger.info('Hello, World!'); // This will log the message to Sentry.
logger.error('Hello, World!'); // This will log the exception to Sentry.
```
