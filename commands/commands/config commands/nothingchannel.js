//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./activity.sqlite');
const Discord = require('discord.js');
const nothingChannelSchema = require('@models/nothing-channel-schema');

module.exports = {
    name: 'nothingchannel',
    examples:['remove #channel', '#channel'],
    description: 'Creates a \'nothing\' channel...',
    expectedArgs: '#channel / remove #channel',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 2,
    memberPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_MESSAGES'],
    execute: async (message, args) => {
        let nothingChannelCollection = nothingChannelSchema;

        //just shows information
        if (args.length === 0) {
            let channels = await nothingChannelCollection.find({ serverID: message.guild.id })

            if (channels.length !== 0) {
                let text = '';
                channels.forEach(channel => {
                    text += `<#${channel.nothingChannelID}>\n`
                });

                let embed = new Discord.MessageEmbed()
                    .setTitle(`'Nothing' channels of ${message.guild.name}`)
                    .setDescription(text)
                    .setColor('#0099ff')

                message.channel.send({embeds: [embed]})
            } else {
                message.channel.send(`Set up a 'nothing' channel using \`e nothingchannel #channel\``)
            }
            return;
        }

        //removes a channel
        else if (args[0] === 'remove') {
            channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();

            if (!channel || channel.type !== "GUILD_TEXT") {
                return message.reply('This is not a valid text channel.')
            }

            await nothingChannelCollection.deleteOne({
                nothingChannelID: channel.id
            })

            message.channel.send(`Removed channel <#${channel.id}>.`);
            return;
        }

        channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();

        if (!channel || channel.type !== "GUILD_TEXT") {
            return message.reply('This is not a valid text channel.')
        }

        let nothingChannels = await nothingChannelCollection.find({ serverID: message.guild.id })
        let double = false;
        nothingChannels.forEach(nothingChannel => {
            if (nothingChannel.nothingChannelID === channel.id) {
                double = true;
            }
        })

        if(double){
            return message.reply('Channel is already set as a \'nothing\' channel')
        }

        let newChannel = new nothingChannelCollection(
            {
                serverID: message.guild.id,
                nothingChannelID: channel.id
            }
        );
        await newChannel.save();

        message.channel.send(`Successfully set a \'nothing\' channel to ${channel.name}!`)
    },
};