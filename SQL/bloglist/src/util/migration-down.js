const { rollbackMigration } = require('./db');

const main = async () => {
  await rollbackMigration();
};

main();
