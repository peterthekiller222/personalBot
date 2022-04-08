const fetch = require('node-fetch');
const Discord = require('discord.js');
const snipeCollection = require('@models/snipe-schema')

module.exports = {
    name: 'snipe',
    description: 'Snipe the last 10 messages',
    expectedArgs: '{num}',

    async execute(message, args) {
        if(args[0]==='enable'){
            if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You require the permission of administrator to do this.')

            await snipeCollection.findOneAndUpdate(
                {
                    _id: message.guild.id
                },
                {
                    _id: message.guild.id,
                    snipeEnabled: true
                },
                {
                    upsert: true,
                }
            )
            return message.channel.send('Sniping has now been enabled on this server.');
        } else if(args[0]==='disable'){
            if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You require the permission of administrator to do this.')

            await snipeCollection.findOneAndUpdate(
                {
                    _id: message.guild.id
                },
                {
                    _id: message.guild.id,
                    snipeEnabled: false
                },
                {
                    upsert: true,
                }
            )
            return message.channel.send('Sniping has now been disabled on this server.');
        }

        let checkSnipes = await snipeCollection.findOne({ _id: message.guild.id });
        if (!checkSnipes || checkSnipes.snipeEnabled === false) {
            return message.reply('Sniping is disabled on this server. To enable it, type \`e snipe enable\`')
        }

        const snipes = message.client.snipes.get(message.channel.id) || [];
        const msg = snipes[args[0] - 1 || 0];
        if (snipes.length === 0) return message.reply('There is nothing to snipe!')
        if (!msg) return message.reply('Invalid snipe');
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(msg.content)
            .setFooter(`Date: ${msg.date} | ${args[0] - 1 + 1 || 1}/${snipes.length}`)


        if (msg.attachment) embed.setImage(msg.attachment);
        message.channel.send({embeds: [embed]})
    },
};