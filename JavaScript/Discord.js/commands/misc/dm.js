const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Get the bot to DM you'),
  async execute(interaction) {
    await interaction.user.send('Here is your requested DM!');
    await interaction.reply({ content: 'Check your DMs!', ephemeral: true });
  },
};
