//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./activity.sqlite');
const Discord = require('discord.js');
const voteChannelSchema = require('@models/vote-channel-schema');

module.exports = {
    name: 'votechannel',
    examples:['remove #channel', '#channel'],
    description: 'Creates an automatic channel for polls',
    expectedArgs: '#channel / remove #channel',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 2,
    memberPermissions: ['ADMINISTRATOR'],
    execute: async (message, args) => {
        let voteChannelCollection = voteChannelSchema;

        //just shows information
        if (args.length === 0) {
            let channels = await voteChannelCollection.find({ serverID: message.guild.id })

            if (channels.length !== 0) {
                let text = '';
                channels.forEach(channel => {
                    text += `<#${channel.voteChannelID}>\n`
                });

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Voting channels of ${message.guild.name}`)
                    .setDescription(text)
                    .setColor('#0099ff')

                message.channel.send({embeds: [embed]})
            } else {
                message.channel.send(`Set up vote channel using \`e votechannel #channel\``)
            }
            return;
        }

        //removes a channel
        else if (args[0] === 'remove') {
            channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();

            if (!channel || channel.type !== "GUILD_TEXT") {
                return message.reply('This is not a valid text channel.')
            }

            await voteChannelCollection.deleteOne({
                voteChannelID: channel.id
            })

            message.channel.send(`Removed channel <#${channel.id}>.`);
            return;
        }

        channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();

        if (!channel || channel.type !== "GUILD_TEXT") {
            return message.reply('This is not a valid text channel.')
        }

        let voteChannels = await voteChannelCollection.find({ serverID: message.guild.id })
        let double = false;
        voteChannels.forEach(voteChannel => {
            if (voteChannel.voteChannelID === channel.id) {
                double = true;
            }
        })

        if(double){
            return message.reply('Channel is already set as a voting channel')
        }

        let newChannel = new voteChannelCollection(
            {
                serverID: message.guild.id,
                voteChannelID: channel.id
            }
        );
        await newChannel.save();

        message.channel.send(`Successfully set a vote channel to ${channel.name}!`)
    },
};