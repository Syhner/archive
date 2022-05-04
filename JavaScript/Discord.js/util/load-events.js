const loadFiles = require('./load-files');

module.exports = async client => {
  const events = await loadFiles(`${process.cwd()}/events/*/*.js`);

  events.forEach(event => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
};
