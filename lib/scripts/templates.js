const EvenEmitter = require('events');
const { createReadStream, createWriteStream } = require('fs');
const { spawn } = require('child_process');
const { templates } = require('../utils');

const emitter = new EvenEmitter();

emitter.on('git', () => {
  spawn('git init', {
    shell: true,
    cwd: process.env.APPNAME,
  });
});

const write = ({ name, data }) => {
  const wstream = createWriteStream(`./${process.env.APPNAME}/${name}`);
  wstream.write(data);
  wstream.end();
};

const read = ({ name, template }) => {
  const rstream = createReadStream(`./lib/templates/${template}`, { encoding: 'utf8' });

  rstream.on('data', (data) => {
    try {
      write({ name, data });
    } catch (e) {
      throw e;
    }
  });
};

module.exports = () => {
  let index = 0;

  while (index < templates.length) {
    read(templates[index]);
    index += 1;
  }

  emitter.emit('git');
};
