const Discord = require('discord.js');
const activitySchema = require('@models/server-activity-schema');
const { showBarChart } = require('@utils/chart')

module.exports = {
    name: 'activity',
    examples: ['messages', 'voice', '@user', '{userid}'],
    description: 'See how many messages you\'ve sent, or the top voice/messages activity of the server',
    expectedArgs: '@user / messages / voice',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 2,
    execute: async (message, args) => {
        let activityCollection = activitySchema(message.guild.id);
        //activity top
        if (args[0] === 'messages' || args[0] === 'top') {
            let activityList = [];
            //all activities of every member in activityList
            (await activityCollection.find()).forEach(activity => {
                if (message.guild.members.cache.get(activity._id)) {
                    activityList.push(activity);
                }
            })

            let messagesPerDay = activityList.map(activity => {
                days = Math.floor((message.createdTimestamp - activity.lastUpdate) / 1000 / 60 / 60 / 24) + 1;
                return Math.round(10 * activity.messages / days) / 10;
            })
            //selection sorts messages
            for (let j = 0; j < 10; j++) {
                let max = j;
                for (let i = j; i < activityList.length; i++) {
                    if (messagesPerDay[i] > messagesPerDay[max]) {
                        max = i;
                    }
                }
                let temp = activityList[j];
                activityList[j] = activityList[max];
                activityList[max] = temp;

                temp = messagesPerDay[j];
                messagesPerDay[j] = messagesPerDay[max];
                messagesPerDay[max] = temp;
            }

            //grabs 10 highest activity
            let list = '';
            let users = [];
            let activities = [];
            for (let i = 0; i < 10; i++) {
                if (activityList[i]) {
                    let days = Math.floor((message.createdTimestamp - activityList[i].lastUpdate) / 1000 / 60 / 60 / 24) + 1;
                    let messagesPerDay = Math.round(10 * activityList[i].messages / days) / 10;
                    if (messagesPerDay > 100) {
                        messagesPerDay = Math.round(messagesPerDay)
                    }
                    await message.guild.members.fetch(`${activityList[i]._id}`).then(member => {
                        users.push(member.user.username);
                        activities.push(messagesPerDay);
                        list += `\n${i + 1}. **${member.displayName}** (${messagesPerDay} m/d)`;
                    }).catch(err => {
                        console.log(err)
                    });
                }
            }
            //prints message activity
            let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Top message activity`)
                .setDescription(list);
            message.channel.send({embeds: [embed]});
            showBarChart(message, users, activities, `Message activity in ${message.guild.name}`, 'messages per day');

        } //total messages
        else if (args[0] === 'voice') {
            let activityList = [];
            //all activities of every member in activityList
            (await activityCollection.find()).forEach(activity => {
                if (message.guild.members.cache.get(activity._id)) {
                    activityList.push(activity);
                }
            })

            let voicePerDay = activityList.map(activity => {
                days = Math.floor((message.createdTimestamp - activity.lastUpdate) / 1000 / 60 / 60 / 24) + 1;
                return Math.round(10 * activity.voice / 60 / days) / 10;
            })

            //selection sorts voice
            for (let j = 0; j < 10; j++) {
                let max = j;
                for (let i = j; i < activityList.length; i++) {
                    if (voicePerDay[i] > voicePerDay[max]) {
                        max = i;
                    }
                }
                let temp = activityList[j];
                activityList[j] = activityList[max];
                activityList[max] = temp;

                temp = voicePerDay[j];
                voicePerDay[j] = voicePerDay[max];
                voicePerDay[max] = temp;
            }

            //grabs 10 highest activity
            let list = '';
            let users = [];
            let activities = [];
            for (let i = 0; i < 10; i++) {
                if (activityList[i]) {
                    let days = Math.floor((message.createdTimestamp - activityList[i].lastUpdate) / 1000 / 60 / 60 / 24) + 1;
                    let voicePerDay = Math.round(10 * activityList[i].voice / 60 / days) / 10;
                    let member = message.guild.members.cache.get(activityList[i]._id)

                    users.push(member.user.username);
                    activities.push(Math.round(10 * voicePerDay / 60) / 10);
                    if (voicePerDay < 60) {
                        list += `\n${i + 1}. **${member.displayName}** (${voicePerDay}min/d)`;
                    }
                    else {
                        list += `\n${i + 1}. **${member.displayName}** (${Math.round(10 * voicePerDay / 60) / 10}hr/d)`;
                    }
                }
            }

            //prints voice activity
            let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Top voice activity`)
                .setDescription(list);
            message.channel.send({embeds: [embed]});
            showBarChart(message, users, activities, `Voice activity of ${message.guild.name}`, 'Voice (hr/d)');
        }
        //it just gives the activity
        else {
            let user;
            //either first mention or author
            await message.guild.members.fetch(args[0]).then(member => {
                user = member.user || message.mentions.users.first() || message.author || message.member.user;
            }).catch(() => {
                user = message.mentions.users.first() || message.author || message.member.user;
            })

            let activity = await activityCollection.findOneAndUpdate(
                {
                    _id: user.id
                },
                {
                    $setOnInsert: {
                        _id: user.id,
                        userTag: user.tag,
                        lastUpdate: message.createdTimestamp,
                        voice: 0,
                        messages: 0,
                        isVoice: false,
                        voiceJoinedStamp: message.createdTimestamp
                    }
                },
                {
                    upsert: true,
                }
            )

            if (!activity) {
                activity = await activityCollection.findOne({
                    _id: message.member.id
                });
            }

            showActivity(activity, message, user);
        }
    },
};

let showActivity = (activity, message, user) => {
    let days = Math.floor((message.createdTimestamp - activity.lastUpdate) / 1000 / 60 / 60 / 24) + 1;
    let messagesPerDay = Math.floor(10 * activity.messages / days) / 10;
    let voicePerDay = activity.voice / 60 / days;

    let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${user.username}'s activity in ${message.guild.name}`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            { name: 'Activity:', value: `${messagesPerDay} m/d`, inline: false },
            { name: 'Total messages:', value: `${activity.messages} messages`, inline: false }
        )

    if (voicePerDay < 60) {
        embed.addFields({ name: 'Voice:', value: `${Math.round(10 * voicePerDay) / 10} min/day`, inline: false })
    } else {
        embed.addFields({ name: 'Voice:', value: `${Math.round(10 * voicePerDay / 60) / 10} hr/day`, inline: false })
    }

    if (activity.voice / 60 < 60) {
        embed.addFields({ name: 'Total voice:', value: `${Math.floor(activity.voice / 60)} minutes`, inline: false })
    } else {
        embed.addFields({ name: 'Total voice:', value: `${Math.round(10 * activity.voice / 60 / 60) / 10} hours`, inline: false })
    }

    embed.addFields({
        name: 'Days logged:', value: `${days} days`, inline: false
    })
        .setFooter(`requested by ${message.author.tag}`);

    //if hes in a call, sends the length of the call
    if (activity.isVoice) {
        let time = Math.floor((Date.now() - activity.voiceJoinedStamp) / 1000);
        let text;

        if (time < 60) text = `${time}s`;
        else if (time / 60 < 60) text = (`${Math.floor(time / 60)}m${Math.floor(time % 60)}s`);
        else text = (`${Math.floor(time / 60 / 60)}hr${Math.floor((time / 60) % 60)}m`);

        embed.addField('In voice for:', `${text}`);
    }

    message.channel.send({embeds: [embed]});
}

