const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simjoin')
    .setDescription('Simulates a user joining the server'),
  async execute(interaction) {
    const { client, member } = interaction;

    client.emit('guildMemberAdd', member);
    await interaction.reply('User join simulated!');
  },
  restrictions: {
    guildOwnerOnly: true,
  },
};
