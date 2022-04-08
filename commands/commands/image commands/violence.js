// const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'violence',
    description: 'Violence may be the answer.',
    expectedArgs: '{message}',
    minArgs: 1,
    guildOnly: true,
    clientPermissions: ['ATTACH_FILES'],
    async execute(message, args) {
        return message.reply("This command is unavailable now")
        let cleanContent = message.cleanContent.slice(prefix.length).trim().split(/ +/);
        cleanContent.shift()

        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            path.join(__dirname, '../../../images/violence.png')
        )
        ctx.drawImage(background, 0, 0);

        //the text
        ctx.fillStyle = '#000000';
        ctx.font = `15px uni-sans-heavy`;
        ctx.fillText(cleanContent.join(' '), 290, 50)

        const attachment = new MessageAttachment(canvas.toBuffer());
        message.channel.send('', attachment);
    },
};