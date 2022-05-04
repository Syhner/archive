const { Client, Intents } = require('discord.js');
const config = require('./config');
const loadCommands = require('./util/load-commands');
const loadEvents = require('./util/load-events');
require('./util/connect-db');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

loadCommands(client);
loadEvents(client);

client.login(config.token);
