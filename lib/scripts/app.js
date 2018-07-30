const { spawn } = require('child_process');
const { createReadStream, createWriteStream } = require('fs');
const { EventEmitter } = require('events');

class AppEmitter extends EventEmitter {
  constructor({ directory }) {
    super();
    this.directory = directory;
  }

  init() {
    const child = spawn('mkdir src', {
      shell: true,
      cwd: this.directory,
    });

    child.on('close', () => {
      const rstream = createReadStream('./lib/templates/app/index');

      rstream.on('data', (data) => {
        const wstream = createWriteStream(`./${this.directory}/src/index.js`);
        wstream.write(data);
        wstream.end();

        wstream.on('close', () => {
          this.emit('app created');
        });
      });
    });
  }
}

module.exports = AppEmitter;
