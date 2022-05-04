module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (
        command.restrictions?.guildOwnerOnly === true &&
        interaction.guild.ownerId !== interaction.user.id
      ) {
        return interaction.reply({
          content: 'Only guild owners can use that command!',
          ephemeral: true,
        });
      }

      if (command.restrictions?.guildOnly === true && !interaction.guild) {
        return interaction.reply({
          content: 'That command can only be used in a server!',
          ephemeral: true,
        });
      }

      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
