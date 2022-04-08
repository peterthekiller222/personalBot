// const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'trash',
    description: 'Shows an image of trash.',
    expectedArgs: '@user',
    guildOnly: true,
    clientPermissions: ['ATTACH_FILES'],
    async execute(message, args) {
        return message.reply("This command is unavailable now")
        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;

        if (member.id === message.client.user.id) {
            return message.reply('I AM NOT TRASH')
        }

        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            path.join(__dirname, '../../../images/trash.png')
        )
        ctx.drawImage(background, 0, 0);

        const pfp = await Canvas.loadImage(
            member.user.displayAvatarURL({
                format: 'jpg'
            })
        )
        let x = canvas.width / 2 - pfp.width / 2;
        let y = canvas.height / 2 - pfp.height / 2;
        ctx.drawImage(pfp, x, y);

        const attachment = new MessageAttachment(canvas.toBuffer());
        message.channel.send('', attachment);
    },
};