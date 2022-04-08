const defaultRoleSchema = require('@models/default-role-schema');
const timeoutSchema = require('@models/timeout-schema');

module.exports = {
    name: 'unmute',
    aliases: ['untimeout'],
    description: 'unmutes a person in server.',
    expectedArgs: '@user',
    guildOnly: true,
    minArgs: 1,
    maxArgs: 1,
    memberPermissions: ['MUTE_MEMBERS'],
    clientPermissions: ['MANAGE_ROLES'],
    async execute(message, args) {
        let defaultRoleCollection = defaultRoleSchema;
        let defaultRole = await defaultRoleCollection.findOne({
            _id: message.guild.id
        }, (err, object) => { }).clone();

        if (!defaultRole || defaultRole.defaultRole == '') {
            return message.reply(`You first have to set up the default role using \`e defaultrole\``);
        }

        let user = message.guild.members.cache.get(args[0]) || message.mentions.users.first();

        // If we have a user mentioned
        if (!user) return message.reply("You didn't mention the user to unmute!");
        if (user.bot) return message.channel.send('You can\'t do this to a bot');
        // Now we get the member from the user
        const member = message.guild.members.cache.get(user.id);
        // If the member is in the guild

        if (!member) return message.reply("That user isn't in this server!");
        member
            .roles.set([defaultRole.defaultRole])
            .then(async () => {
                let timeoutCollection = timeoutSchema;
                const timeouts = await timeoutCollection.deleteMany(
                    {
                        userId: member.id,
                        guildId: message.guild.id
                    }
                )

                message.reply(`Successfully unmuted <@${user.id}>`);
            })
            .catch(err => {
                if (err.message == 'Missing Permissions') {
                    return message.reply('I don\'t have the permissions to do that')
                }
                message.reply('I was unable to unmute the member');
                console.error(err);
            });
    },
};