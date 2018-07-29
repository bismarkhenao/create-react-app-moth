const fs = require('fs');

module.exports = {
  directoryExist: (path) => {
    try {
      return fs.statSync(path).isDirectory();
    } catch (e) {
      return false;
    }
  },
};
