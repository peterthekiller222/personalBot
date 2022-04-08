// const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'whygay',
    description: 'Shows an image of gay.',
    expectedArgs: '@user',
    guildOnly: true,
    clientPermissions: ['ATTACH_FILES'],
    async execute(message, args) {
        return message.reply("This command is unavailable now")
        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;

        if (member.id === message.client.user.id) {
            return message.reply('I AM NOT GAY')
        }

        const canvas = Canvas.createCanvas(940, 518);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            path.join(__dirname, '../../../images/whygay.jpg')
        )
        ctx.drawImage(background, 0, 0);

        const pfp = await Canvas.loadImage(
            member.user.displayAvatarURL({
                format: 'png',
            })
        )

        ctx.drawImage(pfp, 90, 150);

        const attachment = new MessageAttachment(canvas.toBuffer());
        message.channel.send('', attachment);
    },
};