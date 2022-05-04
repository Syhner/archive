const { runMigrations } = require('./db');

const main = async () => {
  await runMigrations();
};

main();
