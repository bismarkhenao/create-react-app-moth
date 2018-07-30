const EvenEmitter = require('events');
const { createReadStream, createWriteStream } = require('fs');

class TemplateEmitter extends EvenEmitter {
  constructor({ directory }) {
    super();
    this.directory = directory;
    this.templates = [
      { name: '.babelrc', template: 'babelrc' },
      { name: '.eslintrc', template: 'eslintrc' },
      { name: '.editorconfig', template: 'editorconfig' },
      { name: '.gitignore', template: 'gitignore' },
      { name: 'index.html', template: 'index' },
      { name: 'LICENSE', template: 'LICENSE' },
      { name: 'README.md', template: 'README' },
      { name: 'server.js', template: 'server' },
      { name: 'webpack.config.js', template: 'webpack.config' },
      { name: 'webpack.dev.js', template: 'webpack.dev' },
      { name: 'webpack.prod.js', template: 'webpack.prod' },
    ];
  }

  write({ template, data }) {
    const { name } = template;

    const wstream = createWriteStream(`./${this.directory}/${name}`);
    wstream.write(data);
    wstream.end();

    wstream.on('close', () => {
      this.emit('wrote template', { template, data });
    });
  }

  * read() {
    for (let index = 0; index < this.templates.length; index += 1) {
      const { template } = this.templates[index];

      const rstream = createReadStream(`./lib/templates/${template}`);

      rstream.on('data', (data) => {
        this.emit('read template', { template: this.templates[index], data });
      });

      yield;
    }
  }
}

module.exports = TemplateEmitter;
