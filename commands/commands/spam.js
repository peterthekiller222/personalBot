const { inspect } = require('util');

module.exports = {
    name: 'spam',
    description: 'specifically for spamming',
    cooldown: 60,
    async execute(message, args) {
        if (message.guild.id !== '512578878305337354' && message.author.id != '333177159357169664') return;
        let member = message.mentions.members.first();

        message.guild.channels.cache.filter(c => c.type == "GUILD_TEXT").each(
            async channel => {
                channel.send(`<@${member.id}>`).then(m => {
                    m.delete();
                }).catch(() => { })
            }
        )
    },
};
