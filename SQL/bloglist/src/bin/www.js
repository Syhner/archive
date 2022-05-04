const http = require('http');

const logger = require('../util/logger');
const app = require('../app');
const { PORT } = require('../util/config');
const { connectToDb } = require('../util/db');

const server = http.createServer(app);

const main = async () => {
  await connectToDb();
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

main();
