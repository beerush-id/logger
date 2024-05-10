import { type Log, type LogAdapter, LogLevel } from '../../index.js';
import { appendFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import * as process from 'node:process';

export type FileConfig = {
  location?: string;
  filename?: string;
  level?: LogLevel;
};

export function fileAdapter(config?: FileConfig): LogAdapter {
  const { location = './logs', filename = '%y-%m-%d.log.toml', level = LogLevel.WARN } = config ?? {};

  const queues: string[] = [];
  let writing = false;
  let dirExists = false;

  const writeToFile = async () => {
    if (!queues.length) return;

    const content = queues.shift();
    if (typeof content !== 'string') return;

    writing = true;

    const date = new Date();
    const file = filename
      .replace(/%y/g, date.getFullYear().toString())
      .replace(/%m/g, (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace(/%d/g, date.getDate().toString().padStart(2, '0'));
    const path = join(process.cwd(), location, file);

    if (!dirExists) {
      try {
        await readdir(join(process.cwd(), location));
      } catch (error) {
        await mkdir(join(process.cwd(), location), { recursive: true });
      }

      dirExists = true;
    }

    try {
      await appendFile(path, content.trim() + '\n\n');
    } catch (error) {
      console.error(error);
    }

    if (queues.length) {
      await writeToFile();
    } else {
      writing = false;
    }
  };

  return {
    name: '@beerush/file',
    emit: (log: Log) => {
      if (level < log.level) return;

      const contents = [
        '[[logs]]',
        `level = ${log.level}`,
        `message = ${JSON.stringify(log.message)}`,
        `timestamp = ${JSON.stringify(log.timestamp.toISOString())}`,
      ];

      if (log.error) {
        if (log.error instanceof Error) {
          contents.push(`error = ${JSON.stringify(log.error.stack)}`);
        } else {
          contents.push(`error = ${JSON.stringify(log.error)}`);
        }
      }

      if (log.extra) {
        contents.push(`extra = ${JSON.stringify(JSON.stringify(log.extra))}`);
      }

      queues.push(contents.join('\n'));

      if (!writing) {
        writing = true;
        writeToFile();
      }
    },
  };
}
