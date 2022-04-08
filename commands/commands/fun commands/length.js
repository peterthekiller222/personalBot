module.exports = {
    name: 'length',
    aliases: ['penis'],
    description: 'Finds your length.',
    expectedArgs: '@user',
    execute(message, args) {
        const user = message.mentions.users.first() || message.author || message.member.user;
        let length = Math.round(Math.random() * 10);
        message.channel.send(`<@${user.id}>'s dick is ${length} inches long`);
    },
};