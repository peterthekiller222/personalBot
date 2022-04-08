module.exports = {
    name: 'gay',
    description: 'Finds out how gay you are.',
    expectedArgs: '@user',
    execute(message, args) {
        let user = message.mentions.users.first() || message.author || message.member.user;
        let gay = Math.round(100*Math.random())
        message.channel.send(`<@${user.id}> is ${gay}% gay`);
    },
};