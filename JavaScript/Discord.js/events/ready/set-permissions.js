const { guildId } = require('../../config');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const commands =
      process.env.NODE_ENV === 'production'
        ? client.application?.commands
        : client.guilds.cache.get(guildId)?.commands;

    const fetchedCommands = await commands.fetch();

    const fullPermissions = fetchedCommands.reduce((arr, command) => {
      const permissions = client.commands.get(command.name).permissions;
      if (permissions) {
        arr.push({
          id: command.id,
          permissions,
        });
      }
      return arr;
    }, []);

    await commands.permissions.set({ fullPermissions });

    console.log(`Permissions set for ${fullPermissions.length} command(s)`);
  },
};
