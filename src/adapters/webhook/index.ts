
import { type Log, type LogAdapter, LogLevel } from '../../logger.js';

export type WebhookConfig = {
  url: string;
  authorization?: string;
  level?: LogLevel;
  debounce?: number;
  maxQueue?: number;
};

export function createWebhook(config: WebhookConfig): LogAdapter {
  const { url, authorization, level = LogLevel.INFO, debounce = 2000, maxQueue = 100 } = config;
  const logs: Log[] = [];

  let timer: number;
  const request = () => {
    clearTimeout(timer);

    timer = setTimeout(
      async () => {
        try {
          const entries = [...logs];
          logs.length = 0;

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };

          if (authorization) {
            headers['Authorization'] = authorization;
          }

          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(entries),
          });

          if (!response.ok) {
            console.error(`Webhook failed with status ${response.status}`, response);
          }
        } catch (error) {
          console.error('Webhook failed', error);
        }
      },
      logs.length < maxQueue ? debounce : 0
    ) as never;
  };

  return {
    name: '@beerush/webhook',
    emit: (log: Log) => {
      if (level < log.level) return;

      const body = { ...log };
      if (body.error instanceof Error) {
        body.error = body.error.stack as never;
      }

      logs.push(body);
      request();
    },
  };
}
