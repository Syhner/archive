const { SlashCommandBuilder } = require('@discordjs/builders');
const model = require('../../models/welcome');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Set a welcome message')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to send welcome messages to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription(
          'The message to send (an @ will be replaced mentioning the member)'
        )
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option
        .setName('notify')
        .setDescription('Notifies the member?')
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (channel.type !== 'GUILD_TEXT') {
      return interaction.reply('You must specify a text channel!');
    }

    const message = interaction.options.getString('message');

    await model.findByIdAndUpdate(
      {
        _id: interaction.guild.id,
      },
      {
        guildId: interaction.guild.id,
        channelId: channel.id,
        message,
        notify: interaction.options.getBoolean('notify'),
      },
      {
        upsert: true,
      }
    );

    interaction.reply('Welcome message has been set!');
  },
  restrictions: {
    guildOwnerOnly: true,
  },
};
