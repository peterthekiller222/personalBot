const timeoutRoleSchema = require('@models/timeout-role-schema');
const timeoutSchema = require('@models/timeout-schema');

module.exports = {
    name: 'mute',
    examples: ['@user 2h spamming', '@user 30m'],
    aliases: ['timeout'],
    description: 'mutes a person in server.',
    expectedArgs: '@user {time} {reason}',
    guildOnly: true,
    minArgs: 2,
    memberPermissions: ['MUTE_MEMBERS'],
    clientPermissions: ['MANAGE_ROLES'],
    async execute(message, args) {
        let timeoutRoleCollection = timeoutRoleSchema;
        let timeout = await timeoutRoleCollection.findOne({
            _id: message.guild.id
        }, (err, object) => { }).clone();

        if (!timeout || timeout.timeoutRole == '') {
            return message.reply(`You first have to set up the mute role using \`e muterole\``);
        }

        let user = message.guild.members.cache.get(args[0]) || message.mentions.users.first();

        // If we dont have a user mentioned
        if (!user) return message.reply("You didn't mention the user to mute!");
        if (user.bot) return message.channel.send('You can\'t do this to a bot');
        // Now we get the member from the user
        const member = message.guild.members.cache.get(user.id);

        // If the member isnt in the guild
        if (!member) return message.reply("That user isn't in this server!");
        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('Unable to timeout someone with an equal or higher role than you');
        }
        if (message.guild.members.cache.get(message.client.user.id).roles.highest.position <= member.roles.highest.position) {
            return message.reply('I\'m unable to timeout someone with an equal or higher role than me');
        }

        args.shift()

        //interprets the time into millesconds
        let time = args[0].toLowerCase();
        let timeNum = parseInt(time);
        if(isNaN(timeNum)) return message.reply(`A valid amount of time could be 2h or 15m`)
        if (time.endsWith('h')) timeNum *= 60 * 60;
        else if (time.endsWith('m')) timeNum *= 60;
        else return message.reply(`A valid amount of time could be 2h or 15m`)

        let expires = new Date()
        expires.setSeconds(expires.getSeconds() + timeNum)
        args.shift();

        member
            .roles.set([timeout.timeoutRole])
            .then(async () => {

                message.reply(`Successfully muted <@${user.id}> for \`${timeNum < 60 ? `${timeNum}s` : timeNum < 3600 ? `${timeNum / 60}m` : `${timeNum / 3600}h`}\``);

                let timeoutCollection = timeoutSchema;
                const timeouts = await timeoutCollection.findOneAndUpdate(
                    {
                        userId: member.id,
                        guildId: message.guild.id
                    },
                    {
                        userId: member.id,
                        guildId: message.guild.id,
                        reason: args.length ? args.join(' ') : 'no reason',
                        staffId: message.author.id,
                        staffTag: message.author.tag,
                        expires: expires,
                        current: true
                    },
                    {
                        upsert: true,
                    }
                )

            })
            .catch(err => {
                if (err.message == 'Missing Permissions') return message.reply('I don\'t have the permissions to do that')

                message.reply('I was unable to unmute the member');
                console.error(err);
            });

    },
};