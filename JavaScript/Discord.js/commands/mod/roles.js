const { SlashCommandBuilder } = require('@discordjs/builders');

// TODO: Allow non guild owners to change roles
// But only for a role that is under theirs
module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Add or remove roles from members')
    .addStringOption(option =>
      option
        .setName('action')
        .setDescription('Do you want to add or remove a role?')
        .setRequired(true)
        .addChoice('add', 'add')
        .addChoice('remove', 'remove')
    )
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role to add or remove')
        .setRequired(true)
    )
    .addMentionableOption(option =>
      option
        .setName('target')
        .setDescription('Users to target (change roles for)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const target = interaction.options.getMentionable('target');
    const action = interaction.options.getString('action');

    const verb = action === 'add' ? 'Added' : 'Removed';
    const toFrom = action === 'add' ? 'to' : 'from';
    const roleMention = `<@&${role.id}>`;
    const fromMention =
      target.constructor.name === 'GuildMember'
        ? `<@!${target.user.id}>`
        : `<@&${target.id}>`;
    const reply = [verb, roleMention, toFrom, fromMention].join(' ');

    // For a member
    if (target.constructor.name === 'GuildMember') {
      try {
        await target.roles[action](role);
        interaction.reply(reply);
      } catch (err) {
        interaction.reply('Missing permissions to do that!');
      }
    }
    // For several members
    else {
      const output = await Promise.allSettled(
        target.members.map(member => member.roles[action](role))
      );

      const fulfilledCount = output.filter(
        promise => promise.status === 'fulfilled'
      ).length;

      interaction.reply(
        `${reply} (${fulfilledCount} of ${target.members.size})`
      );
    }
  },
  restrictions: {
    guildOwnerOnly: true,
  },
};
