# Webhook Adapter

The webhook adapter sends logs to a webhook URL. This adapter is useful when you want to send logs to an external
service.

## Usage

You can use the webhook adapter as shown below:

```typescript
import { logger } from './logger.ts';
import { webhookAdapter } from '@beerush/logger/adapters/webhook';

logger.use(webhookAdapter({
  url: 'https://example.com/logs',
  level: LogLevel.ERROR
}));

logger.info('Hello, World!'); // This will not log the message to the webhook URL.
logger.error('Hello, World!'); // This will log the message to the webhook URL.
```

### Options

- **url**: The URL to which the logs will be sent.
- **level** *optional*: The log level at which the logs will be sent to the webhook URL. The default value
  is `LogLevel.INFO`.
- **authorization** *optional*: The authorization header to be sent with the request. For example, you can set it
  to `Bearer <token>`.
- **debounce** *optional*: The debounce time in milliseconds. If set, the logs will be debounced and sent in a single
  request after the debounce time has passed. The default value is `2000`.
- **maxQueue** *optional*: The maximum number of logs that can be queued. If the number of logs exceeds this value, the
  logs will be sent immediately, ignoring to debounce. The default value is `100`.
