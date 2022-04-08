// const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'simpcard',
    description: 'Shows a simp.',
    expectedArgs: '@user',
    guildOnly: true,
    clientPermissions: ['ATTACH_FILES'],
    async execute(message, args) {
        return message.reply("This command is unavailable now")
        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;

        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            path.join(__dirname, '../../../images/simpcard.jpg')
        )
        ctx.drawImage(background, 0, 0);

        const pfp = await Canvas.loadImage(
            member.user.displayAvatarURL({
                format: 'jpg'
            })
        )
        ctx.drawImage(pfp, 50, 230);

        const attachment = new MessageAttachment(canvas.toBuffer());
        message.channel.send('', attachment);
    },
};