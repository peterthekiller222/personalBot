module.exports = {
    name: 'kick',
    description: 'Kicks a person.',
    expectedArgs: '@user {reason}',
    guildOnly: true,
    minArgs: 1,
    memberPermissions: ['KICK_MEMBERS'],
    clientPermissions: ['KICK_MEMBERS'],
    async execute(message, args) {

        const user = message.guild.members.cache.get(args[0])?.user || message.mentions.users.first();
        // If we dont have a user mentioned
        if (!user) return message.reply("You didn't mention the user to ban!");
        // Now we get the member from the user
        const member = message.guild.members.cache.get(user.id);
        // If the member isnt in the guild

        if (!member) return message.reply("That user isn't in this guild!");
        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('Unable to kick someone with an equal or higher role than you');
        }

        args.shift()
        member
            .kick(`by ${message.author.tag}: ${args.join(' ')}`)
            .then(() => {
                // We let the message author know we were able to kick the person
                message.reply(`Successfully kicked ${user.tag}`);
            })
            .catch(err => {
                // either due to missing permissions or role hierarchy
                message.reply('I was unable to kick the member');
                console.error(err);
            });
    }
}



