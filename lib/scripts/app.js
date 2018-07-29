const { spawn } = require('child_process');
const { createReadStream, createWriteStream } = require('fs');

const create = () => {
  const child = spawn('mkdir src', {
    shell: true,
    cwd: process.env.APPNAME,
  });

  child.on('close', () => {
    const rstream = createReadStream('./lib/templates/app', { encoding: 'utf8' });

    rstream.on('data', (data) => {
      const wstream = createWriteStream(`./${process.env.APPNAME}/src/index.js`);
      wstream.write(data);
      wstream.end();
    });
  });
};

module.exports = () => {
  create();
};
