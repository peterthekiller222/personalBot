module.exports = {
    name: 'pfp',
    description: 'Gives the user\'s picture.',
    expectedArgs: '@user',
    guildOnly: true,
    async execute(message, args) {
        let user;
        await message.guild.members.fetch(args[0]).then(member => {
            user = member.user || message.mentions.users.first() || message.author || message.member.user;
        }).catch((err) => {
            user = message.mentions.users.first() || message.author || message.member.user;
        })

        message.channel.send(`${user.displayAvatarURL({ size: 4096, dynamic: true })}`);
    },
};