const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerId } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpresence')
    .setDescription("Sets the bot's presence (status and activity)")
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('status')
        .setDescription("The bot's status")
        .setRequired(true)
        .addChoices([
          ['online', 'online'],
          ['idle', 'idle'],
          ['dnd', 'dnd'],
        ])
    )
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription("The bot's activity type")
        .setRequired(true)
        .addChoices([
          ['Playing', 'PLAYING'],
          ['Listening to', 'LISTENING'],
          ['Watching', 'WATCHING'],
          ['Competing in', 'COMPETING'],
        ])
    )
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription("The bot's activity name")
        .setRequired(true)
    ),
  async execute(interaction) {
    const status = interaction.options.getString('status');
    const type = interaction.options.getString('type');
    const name = interaction.options.getString('name');

    interaction.client.user.setPresence({
      activities: [{ type, name }],
      status,
    });
    await interaction.reply({
      content: 'Bot presence has been set!',
      ephemeral: true,
    });
  },
  permissions: [
    {
      id: ownerId,
      type: 'USER',
      permission: true,
    },
  ],
};
