#!/usr/bin/env node

const chalk = require('chalk');

const { error } = console;

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 8) {
  error(
    chalk.red(
      `You are running Node ${
        currentNodeVersion
      }.\n`
      + 'Create React App Moth requires Node 8 or higher. \n'
      + 'Please update your version of Node.',
    ),
  );
  process.exit(1);
}

require('./lib');
