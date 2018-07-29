const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const validatePackageName = require('validate-npm-package-name');
const EventEmitter = require('events');
// const { createReadStream, createWriteStream } = require('fs');
const { spawn } = require('child_process');
// const { Spinner } = require('clui');
const { files } = require('./utils');
const { packages, templates, app } = require('./scripts');

const { log, clear } = console;

clear();
log(chalk.blue(figlet.textSync('Moth React App', {
  horizontalLayout: 'universal smushing',
})));

inquirer.prompt([
  {
    name: 'appName',
    type: 'input',
    message: 'Choose the name of the app:',
    validate: (input) => {
      const validation = validatePackageName(input);

      if (files.directoryExist(input)) {
        return 'project already exists';
      }

      if (validation.errors) {
        return chalk.red.bold(validation.errors.join('\n'));
      }

      if (validation.warnings) {
        return chalk.red.bold(validation.warnings.join('\n'));
      }

      return true;
    },
  },
]).then(({ appName }) => {
  const emitter = new EventEmitter();

  emitter.on('templates', () => {
    templates();
  });

  emitter.on('packages', () => {
    packages();
  });

  emitter.on('app', () => {
    app();
  });

  try {
    process.env.APPNAME = appName;
    const child = spawn(`mkdir ${appName}`, { shell: true });

    child.on('close', () => {
      emitter.emit('templates');
      emitter.emit('packages');
      emitter.emit('app');
    });
  } catch (e) {
    spawn(`rm -rf ${appName}`, { shell: true });
    throw e;
  }
});
