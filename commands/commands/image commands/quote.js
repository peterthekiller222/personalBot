// const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'quote',
    description: 'Quotes a person',
    expectedArgs: '@user {quote}',
    guildOnly: true,
    minArgs: 2,
    clientPermissions: ['ATTACH_FILES'],
    async execute(message, args) {
        return message.reply("This command is unavailable now")
        let member = message.mentions.members.first();

        if (!member) return message.reply('You need to specify a member to quote.')

        let content = message.cleanContent.trim().split(/ +/);
        for (let i = 0; i < 2 + (member.displayName).split(' ').length; i++) {
            content.shift()
        }

        const canvas = Canvas.createCanvas(1200 + 25 * args.join(' ').length, 400);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            path.join(__dirname, '../../../images/discordbackground.png')
        )
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const marginLeft = 25;
        const marginTop = 50;
        const pfpSize = 240;
        const fontHeight = 75;

        //the name
        ctx.fillStyle = member.displayHexColor === '#000000' ? '#FFFFFF' : member.displayHexColor;
        ctx.font = `bold ${fontHeight}px uni-sans-heavy`;
        let displayName = member.displayName;
        ctx.fillText(displayName, marginLeft + pfpSize + 75, marginTop + fontHeight)

        //the date
        ctx.fillStyle = '#797F84';
        ctx.font = `bold 60px system-ui`;
        let date = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        ctx.fillText(date, marginLeft + pfpSize + 75 + ctx.measureText(displayName).width * 1.7 + 30, marginTop + fontHeight)

        //the actual text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = ` ${fontHeight}px uni-sans`;
        let text = content.join(' ')
        ctx.fillText(text, marginLeft + pfpSize + 75, marginTop + pfpSize - 30)

        // Pick up the pen
        ctx.beginPath();
        // Start the arc to form a circle
        ctx.arc(pfpSize / 2 + marginLeft, pfpSize / 2 + marginTop, pfpSize / 2, 0, Math.PI * 2, true);
        // Put the pen down
        ctx.closePath();
        // Clip off the region you drew on
        ctx.clip();

        const pfp = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', }))
        ctx.drawImage(pfp, marginLeft, marginTop, pfpSize, pfpSize);


        const attachment = new MessageAttachment(canvas.toBuffer());
        message.channel.send('', attachment);
    },
};