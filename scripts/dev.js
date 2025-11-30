#!/usr/bin/env node
const concurrently = require('concurrently');
const chalk = require('chalk');
const Logger = require('./helpers/logger');
const ms = require('ms');

const start = new Date().getTime();

Logger.info('Starting DEVELOPMENT MODE');

(async () => {
  try {
    const { result } = concurrently(
      [
        {
          name: chalk.magenta('next'),
          command: 'npm run dev:next-only',
        },
        {
          name: chalk.cyan('tsc'),
          command: 'npm run dev:tsc',
        },
      ],
      {
        prefix: 'name',
        killOthersOn: ['failure'],
        restartTries: 0,
        timestampFormat: 'HH:mm:ss',
      }
    );

    result.then(
      () => {
        const finish = new Date().getTime();
        Logger.success(chalk.green(`Development Mode ran for ${ms(finish - start)}`));
        process.exit(0);
      },
      (err) => {
        Logger.error(chalk.red('Error occurred during development'));
        console.error(err);
        process.exit(1);
      }
    );
  } catch (err) {
    Logger.error(chalk.red('Failed to start development mode'));
    console.error(err);
    process.exit(1);
  }
})();
