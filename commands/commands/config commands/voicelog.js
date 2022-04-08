//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./activity.sqlite');
const Discord = require('discord.js');
const vlogSchema = require('@models/vlog-schema');

module.exports = {
    name: 'voicelog',
    aliases: ['vlog'],
    examples: ['#channel', 'remove'],
    description: 'Logs all voice into a channel.',
    expectedArgs: '#channel',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 1,
    memberPermissions: ['ADMINISTRATOR'],
    execute: async (message, args) => {
        let vlogCollection = vlogSchema;

        if (args.length === 0) {
            let channel = await vlogCollection.findOne({ _id: message.guild.id })
            if (channel && channel.vlogChannelID !== '') {
                message.channel.send(`Current voice log channel: <#${channel.vlogChannelID}>`)
            } else {
                message.channel.send(`Set up voice logging channel using \`e voicelog #channel\``)
            }
            return;
        }

        if (args[0] === 'off' || args[0] === 'remove') {
            await vlogCollection.findOneAndUpdate(
                {
                    _id: message.guild.id
                },
                {
                    _id: message.guild.id,
                    vlogChannelID: ''
                },
                {
                    upsert: true,
                }
            ).exec()
            return message.channel.send(`Successfully removed voice logging`);
        }

        channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();

        if (!channel || channel.type !== "GUILD_TEXT") {
            return message.reply('This is not a valid text channel.')
        }

        vlogCollection.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                _id: message.guild.id,
                vlogChannelID: channel.id
            },
            {
                upsert: true,
            }
        ).exec()

        message.channel.send(`Successfully set the voice log channel to ${channel.name}!`)
    },
};
