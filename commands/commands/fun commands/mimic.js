const Discord = require('discord.js');


module.exports = {
    name: 'mimic',
    examples: ['@user I am beautiful'],
    description: 'Mimics someone',
    expectedArgs: '@user {phrase}',
    minArgs: 2,
    guildOnly: true,
    clientPermissions: ['MANAGE_WEBHOOKS'],
    async execute(message, args) {
        if (message.mentions.everyone || message.cleanContent.includes('@everyone') || message.cleanContent.includes('@here')) {
            return message.reply('I won\'t mention everyone');
        }

        let { channel } = message;

        let member = message.mentions.members.first();
        if (!member) return message.reply('That is not a valid member.')

        // let content = message.cleanContent.trim().split(/ +/);
        // for (let i = 0; i < 2 + (member.displayName).split(' ').length; i++) {
        //     content.shift()
        // }
        args.shift();
        let content = args;

        let avatarURL = member.user.displayAvatarURL()

        channel.fetchWebhooks().then(async webhookCollection => {
            let foundHook = webhookCollection.find(hook => hook.name === 'oogie-boogie-mimic');
            if (!foundHook) {
                foundHook = await channel.createWebhook('oogie-boogie-mimic', {avatar: avatarURL, reason: 'oogie boogie mimic'});
            }

            foundHook.send({
                content: content.join(' '),
                username: member.displayName,
                avatarURL: avatarURL
            })
        })
    },
};