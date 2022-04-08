const Discord = require('discord.js');
const timeoutRoleSchema = require('@models/timeout-role-schema');
const defaultRoleSchema = require('@models/default-role-schema');
const autoRoleSchema = require('@models/autorole-schema');
const vlogSchema = require('@models/vlog-schema');
const voteChannelSchema = require('@models/vote-channel-schema');

module.exports = {
    name: 'settings',
    aliases:['config'],
    description: 'Settings of this server.',
    guildOnly: true,
    async execute(message, args) {

        let { guild } = message;

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${guild.name}'s settings`)
            .setFooter(`requested by ${message.author.tag}`)

        //if theres any default roles settings
        let defaultRoleCollection = defaultRoleSchema;
        let defaultRoleObj = await defaultRoleCollection.findOne({
            _id: guild.id
        })

        let defaultRole = 'none';
        if (defaultRoleObj) {
            if (defaultRoleObj.defaultRole !== '') {
                defaultRole = `<@&${defaultRoleObj.defaultRole}>`;
            }
        }

        embed.addFields(
            { name: 'Default role:', value: `${defaultRole}`, inline: true },
        )

        //if theres any timeout roles settings
        let timeoutRoleCollection = timeoutRoleSchema;
        let timeoutRoleObj = await timeoutRoleCollection.findOne({
            _id: guild.id
        })
        let timeoutRole = 'none';
        if (timeoutRoleObj) {
            if (timeoutRoleObj.timeoutRole !== '') {
                timeoutRole = `<@&${timeoutRoleObj.timeoutRole}>`;
            }
        }

        embed.addFields(
            { name: 'Muted role:', value: `${timeoutRole}`, inline: true },
        )

        //if theres any auto role settings
        let autoRoleCollection = autoRoleSchema;
        let autoRoleObject = await autoRoleCollection.findOne({
            _id: guild.id
        })
        let autoRole = 'none';
        if (autoRoleObject && autoRoleObject.autoRole !== '') {
            autoRole = `<@&${autoRoleObject.autoRole}>`;
        }
        embed.addFields(
            { name: 'Auto role: ', value: `${autoRole}`, inline: true }
        )

        //if theres any vlog settings
        let vlogCollection = vlogSchema;
        let vlogObject = await vlogCollection.findOne({
            _id: guild.id
        })
        let vlogChannel = 'none'
        if (vlogObject && vlogObject.vlogChannelID !== '') {
            vlogChannel = `<#${vlogObject.vlogChannelID}>`;
        }
        embed.addFields(
            { name: 'Voice log channel: ', value: `${vlogChannel}`, inline: true }
        )

        //if theres any vote channel settings
        let voteChannelCollection = voteChannelSchema;
        let voteChannelsArray = await voteChannelCollection.find({
            serverID: guild.id
        })

        let voteChannels = 'none'
        if (voteChannelsArray.length !== 0) {
            voteChannels = '';
            voteChannelsArray.forEach(channel => {
                voteChannels += `<#${channel.voteChannelID}>\n`
            });
        }

        embed.addFields(
            { name: 'Voting channels: ', value: `${voteChannels}`, inline: true }
        )

        message.channel.send({embeds: [embed]});
    },
};