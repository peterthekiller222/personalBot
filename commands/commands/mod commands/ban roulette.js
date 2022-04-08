module.exports = {
    name: 'banroulette',
    description: 'Bans a randomly picked person.',
    guildOnly: true,
    memberPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['BAN_MEMBERS'],
    async execute(message, args) {

        let members = await message.guild.members.fetch();

        //filters all the bots out
        members = members.filter(member => !member.user.bot)
        let member = members.random()

        member
            .ban({
                reason: `by ban roulette!`,
            })
            .then(() => {
                // We let the message author know we were able to ban the person
                message.reply(`Successfully banned ${member.user}`);
            })
            .catch(err => {
                // either due to missing permissions or role hierarchy
                message.reply(`Attempted to ban ${member.user} but failed. (Probably due to permission errors)`);
                // Log the error
                console.error(err);
            });
    },
};