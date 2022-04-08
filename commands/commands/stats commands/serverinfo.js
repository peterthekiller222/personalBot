const Discord = require('discord.js');
const activitySchema = require('@models/server-activity-schema');

module.exports = {
    name: 'serverinfo',
    description: 'Information on the server.',
    guildOnly: true,
    async execute(message, args) {
        let activityCollection = activitySchema(message.guild.id);
        let totalMessages = 0;
        let totalVoice = 0;

        (await activityCollection.find()).forEach(activity => {
            if (message.guild.members.cache.get(activity._id)) {
                totalMessages += activity.messages;
                totalVoice += activity.voice;
            }
        })



        let { guild } = message;
        let daysCreated = Math.round((message.createdTimestamp - guild.createdTimestamp) / 1000 / 60 / 60 / 24)

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Information on ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Servername:', value: `${guild.name}`, inline: true },
                { name: 'Owner:', value: `<@!${guild.ownerId}>`, inline: true },
                { name: 'ID:', value: `${guild.id}`, inline: true },
                { name: 'Created at:', value: `\`${guild.createdAt.toDateString()}\` (${daysCreated} days ago)` },
                { name: 'Channels:', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Members:', value: `${guild.memberCount}`, inline: true },
                { name: 'Roles:', value: `${guild.roles.cache.size - 1}`, inline: true },
                { name: 'Total messages logged:', value: `${totalMessages} messages`, inline: false },
                { name: 'Total hours logged:', value: `${Math.floor(10 * totalVoice / 60 / 60) / 10} hours`, inline: false },
            )
            .setFooter(`requested by ${message.author.tag}`)
        message.channel.send({embeds: [embed]});
    },
};