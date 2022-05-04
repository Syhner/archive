const { promisify } = require('util');
const glob = require('glob');

module.exports = async path => {
  const globPromise = promisify(glob);
  const filesNames = await globPromise(path);
  return filesNames.map(file => require(file));
};
