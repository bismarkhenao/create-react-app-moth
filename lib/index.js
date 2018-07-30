const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const validatePackageName = require('validate-npm-package-name');
const { spawn } = require('child_process');
const { files } = require('./utils');
const { PackageEmitter, TemplateEmitter, AppEmitter } = require('./scripts');

const { log, clear } = console;

clear();
log(chalk.blue(figlet.textSync('React App Moth', {
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
  const packageEmitter = new PackageEmitter({ directory: appName });
  const templateEmitter = new TemplateEmitter({ directory: appName });
  const appEmitter = new AppEmitter({ directory: appName });

  packageEmitter.on('package created', () => {
    packageEmitter.installDependencies();
  });

  packageEmitter.on('package dependencies installed', () => {
    packageEmitter.installDependencies({ dev: true });
  });

  packageEmitter.on('package devDependencies installed', () => {
    const readGenerator = templateEmitter.read();

    while (!readGenerator.next().done) {
      readGenerator.next();
    }

    appEmitter.init();
  });

  templateEmitter.on('read template', ({ template, data }) => {
    templateEmitter.write({ template, data });
  });

  appEmitter.on('app created', () => {
    spawn('git init', {
      shell: true,
      cwd: appName,
    });
  });

  try {
    process.env.APPNAME = appName;
    const child = spawn(`mkdir ${appName}`, { shell: true });

    child.on('close', () => {
      packageEmitter.init();
    });
  } catch (e) {
    spawn(`rm -rf ${appName}`, { shell: true });
    throw e;
  }
});
