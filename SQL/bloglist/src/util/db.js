const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const { DATABASE_URL } = require('./config');
const logger = require('./logger');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const migrationConfig = {
  migrations: {
    glob: 'src/migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig);
  const migrations = await migrator.up();

  logger.info('Migrations up to date', {
    files: migrations.map(mig => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConfig);
  await migrator.down();
};

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === 'production') {
      await runMigrations();
    }
    logger.info('connected to the database');
  } catch (err) {
    logger.error('failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

module.exports = { sequelize, connectToDb, runMigrations, rollbackMigration };
