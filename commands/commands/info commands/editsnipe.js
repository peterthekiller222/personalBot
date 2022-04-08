const Discord = require('discord.js');

module.exports = {
    name: 'editsnipe',
    description: 'Edit snipe the last 10 messages',
    expectedArgs: '{num}',

    async execute(message, args) {
        const editSnipes = message.client.editSnipes.get(message.channel.id) || [];
        const msg = editSnipes[args[0] - 1 || 0];
        if (editSnipes.length === 0) return message.reply('There is nothing to snipe!')
        if (!msg) return message.reply('That is not a valid snipe...');
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                {
                    name: 'Old message:',
                    value: msg.oldContent
                },
                {
                    name: 'New message:',
                    value: msg.newContent
                }
            )
            .setFooter(`Date: ${msg.date} | ${args[0] || 1}/${editSnipes.length}`)

        if (msg.attachment) embed.setImage(msg.attachment);
        message.channel.send({embeds: [embed]})
    },
};