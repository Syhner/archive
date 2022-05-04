const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Start a timer with a custom duration')
    .addNumberOption(option =>
      option
        .setName('seconds')
        .setDescription('The number of seconds to time')
        .setRequired(true)
        .setMaxValue(900)
    ),
  async execute(interaction) {
    const seconds = interaction.options.getNumber('seconds');
    await interaction.reply(`Started a ${seconds} second timer...`);

    const wait = util.promisify(setTimeout);
    await wait(seconds * 1000);

    await interaction.followUp(`${seconds} second(s) up!`);
  },
};
