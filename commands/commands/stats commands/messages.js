const Discord = require('discord.js');
const activitySchema = require('@models/server-activity-schema');
const { showBarChart } = require('@utils/chart')

module.exports = {
    name: 'messages',
    description: 'See the total messages of the server',
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

        activityList.sort((a, b) => b.messages - a.messages)

        //grabs 10 highest activity
        let list = '';
        let users = [];
        let activities = [];
        for (let i = 0; i < 10; i++) {
            if (activityList[i]) {
                let messages = activityList[i].messages;
                await message.guild.members.fetch(`${activityList[i]._id}`).then(member => {
                    users.push(member.user.username);
                    activities.push(messages);
                    list += `\n${i + 1}. **${member.displayName}** (${messages} messages)`;
                }).catch(err => {
                    console.log(err)
                });
            }
        }
        //prints message activity
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Total messages sent`)
            .setDescription(list);
        message.channel.send({embeds: [embed]});
        showBarChart(message, users, activities, `Total messages in ${message.guild.name}`, 'messages');
    },
};