const Discord = require('discord.js');
const activitySchema = require('@models/server-activity-schema');
const { showBarChart } = require('@utils/chart')

module.exports = {
    name: 'voice',
    description: 'Top total voice of this server',
    guildOnly: true,
    execute: async (message, args) => {
        let activityCollection = activitySchema(message.guild.id);
        
        let activityList = [];
        //all activities of every member in activityList
        (await activityCollection.find()).forEach(activity => {
            if (message.guild.members.cache.get(activity._id)) {
                activityList.push(activity);
            }
        })

        //VOICE IS IN SECONDS
        activityList.sort((a, b) => b.voice - a.voice)

        //grabs 10 highest activity
        let list = '';
        let users = [];
        let activities = [];
        for (let i = 0; i < 10; i++) {
            if (activityList[i]) {
                let totalVoice = Math.round(activityList[i].voice / 60);
                let member = message.guild.members.cache.get(activityList[i]._id)

                users.push(member.user.username);
                activities.push(Math.round(10 * totalVoice / 60) / 10);
                if (totalVoice < 60) {
                    list += `\n${i + 1}. **${member.displayName}** (${totalVoice} mins)`;
                }
                else {
                    list += `\n${i + 1}. **${member.displayName}** (${Math.round(10 * totalVoice / 60) / 10} hours)`;
                }
            }
        }

        //prints voice activity
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Top voice activity`)
            .setDescription(list);
        message.channel.send({embeds: [embed]});
        showBarChart(message, users, activities, `Total voice of ${message.guild.name}`, 'Total Voice (hours)');
    },
};