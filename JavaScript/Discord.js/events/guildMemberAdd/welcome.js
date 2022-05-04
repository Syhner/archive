const model = require('../../models/welcome');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const { guild } = member;

    const res = await model.findById(guild.id);
    console.log(res);
    if (!res) return;
    const { channelId, message, notify } = res;

    await guild.channels.cache.get(channelId).send({
      content: message.replace(/@/g, `<@${member.id}>`),
      allowedMentions: notify ? { users: [member.id] } : { users: [] },
    });
  },
};
