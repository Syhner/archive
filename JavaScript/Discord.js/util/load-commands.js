const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const loadFiles = require('./load-files');
const { clientId, guildId, token } = require('../config');

module.exports = async client => {
  // Attach commands to client instance to be accessible everywhere
  client.commands = new Collection();
  const slashCommands = [];

  // Read files in commands directory
  const commands = await loadFiles(`${process.cwd()}/commands/*/*.js`);

  // Add each command to client and push data to JSON for registering
  commands.forEach(command => {
    client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());
  });

  // Register slash commands

  const rest = new REST({ version: '9' }).setToken(token);

  const appCommands =
    process.env.NODE_ENV === 'production'
      ? Routes.applicationCommands
      : Routes.applicationGuildCommands;

  console.log('Started refreshing (/) commands');

  rest
    .put(appCommands(clientId, guildId), {
      body: slashCommands,
    })
    .then(() => console.log('Successfully reloaded (/) commands'))
    .catch(console.error);
};
