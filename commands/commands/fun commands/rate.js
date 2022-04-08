module.exports = {
    name: 'rate',
    description: 'Rates a user on anything',
    expectedArgs: '@user {something to rate}',
    examples: ['@user math skills'],
    execute(message, args) {
        if (message.mentions.everyone || message.cleanContent.includes('@everyone') || message.cleanContent.includes('@here')) {
            return message.reply('I won\'t mention everyone');
        }

        let member = message.mentions.members.first();

        if (!member) return message.reply("Plesae specify a member")

        let content = message.cleanContent.trim().split(/ +/);
        for (let i = 0; i < 2 + (member.displayName).split(' ').length; i++) {
            content.shift()
        }
        if(!content.length) return message.reply("Please specify what to rate")

        message.channel.send(`<@${member.id}>'s ${content.join(" ")}: ${Math.round(100*Math.random())}%`);
    },
};