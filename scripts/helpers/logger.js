const chalk = require('chalk');

class Logger {
  static info(message) {
    console.log(chalk.gray('[info]'), message);
  }

  static success(message) {
    console.log(chalk.green('[success]'), message);
  }

  static error(message) {
    console.log(chalk.red('[error]'), message);
  }

  static warn(message) {
    console.log(chalk.yellow('[warn]'), message);
  }
}

module.exports = Logger;
