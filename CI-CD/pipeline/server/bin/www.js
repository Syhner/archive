const http = require('http');

const logger = require('../util/logger');
const app = require('../app');
const { port } = require('../config');

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
