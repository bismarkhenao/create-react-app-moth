const chalk = require('chalk');
const { spawn } = require('child_process');
const { createWriteStream } = require('fs');

const { log } = console;

const pkgDependencies = [
  'axios@^0.18.0',
  'classnames@^2.2.6',
  'emotion@^9.2.6',
  'express@^4.16.3',
  'express-history-api-fallback@^2.2.1',
  'lodash@^4.17.10',
  'prop-types@^15.6.2',
  'react@^16.4.1',
  'react-dom@^16.4.1',
  'react-emotion@^9.2.6',
  'react-hot-loader@^4.3.4',
  'react-jss@^8.6.1',
  'react-redux@^5.0.7',
  'react-router-config@^1.0.0-beta.4',
  'react-router-dom@^4.3.1',
  'redux@^4.0.0',
  'redux-actions@^2.6.1',
  'redux-logger@^3.0.6',
  'redux-thunk@^2.3.0',
];

const pkgDevDependencies = [
  'axios-mock-adapter',
  'babel-cli',
  'babel-eslint',
  'babel-jest',
  'babel-loader',
  'babel-plugin-transform-decorators-legacy',
  'babel-polyfill',
  'babel-preset-env',
  'babel-preset-react',
  'babel-preset-stage-0',
  'clean-webpack-plugin',
  'enzyme',
  'enzyme-adapter-react-16',
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-import',
  'eslint-plugin-jest',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'html-webpack-plugin',
  'jest',
  'react-test-renderer',
  'webpack',
  'webpack-cli',
  'webpack-dev-server',
  'webpack-merge',
];

const installDevDependencies = (directory) => {
  log(chalk.blue.bold('\nInstalling devDependencies'));

  const child = spawn(`yarn add ${pkgDevDependencies.join(' ')} --dev`, {
    shell: true,
    stdio: 'inherit',
    cwd: directory,
  });

  child.on('close', () => {
    log(chalk.green.bold('\n✔ package.json created'));
  });
};

const installDependencies = (directory) => {
  log(chalk.blue.bold('\nInstalling dependencies'));

  const child = spawn(`yarn add ${pkgDependencies.join(' ')}`, {
    shell: true,
    stdio: 'inherit',
    cwd: directory,
  });

  child.on('close', () => {
    installDevDependencies(directory);
  });
};

const create = (directory) => {
  const pkg = {
    name: directory,
    version: '0.0.0',
    license: 'MIT',
    scripts: {
      development: 'webpack-dev-server --config webpack.dev.js',
      build: 'webpack --config webpack.prod.js',
      start: 'node server.js',
      test: 'jest',
      lint: 'eslint --cache --color src',
      'heroku-postbuild': 'yarn build',
    },
  };

  const wstream = createWriteStream(`./${directory}/package.json`);
  wstream.write(JSON.stringify(pkg, null, 2));
  wstream.end();

  wstream.on('finish', () => {
    installDependencies(directory);
  });
};

module.exports = () => {
  create(process.env.APPNAME);
};
