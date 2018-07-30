const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const { EventEmitter } = require('events');

class PackageEmitter extends EventEmitter {
  constructor({ directory }) {
    super();

    this.directory = directory;

    this.pkg = {
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

    this.pkgDependencies = [
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

    this.pkgDevDependencies = [
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
  }

  installDependencies({ dev = false } = {}) {
    const dependencies = dev ? `${this.pkgDevDependencies.join(' ')} --dev` : this.pkgDependencies.join(' ');

    const child = spawn(`yarn add ${dependencies}`, {
      shell: true,
      stdio: 'inherit',
      cwd: this.directory,
    });

    child.on('close', () => {
      if (dev) {
        this.emit('package devDependencies installed');
      } else {
        this.emit('package dependencies installed');
      }
    });
  }

  init() {
    const wstream = createWriteStream(`./${this.directory}/package.json`);
    wstream.write(JSON.stringify(this.pkg, null, 2));
    wstream.end();

    wstream.on('finish', () => {
      this.emit('package created');
    });
  }
}

module.exports = PackageEmitter;
