//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./activity.sqlite');
const Discord = require('discord.js');
const activitySchema = require('@models/server-activity-schema');

module.exports = {
    name: 'activity-reset',
    description: 'Resets the activity.',
    expectedArgs: '@user / all',
    examples: ['@user', 'all'],
    guildOnly: true,
    minArgs: 0,
    maxArgs: 1,
    memberPermissions: ['ADMINISTRATOR'],
    execute: async (message, args) => {
        let activityCollection = activitySchema(message.guild.id);

        if (args[0].toLowerCase() === 'all') {
            (await activityCollection.find()).forEach(async element => {
                await element.updateOne({
                    lastUpdate: message.createdTimestamp,
                    messages: 0,
                    voice: 0,
                    isVoice: false,
                    voiceJoinedStamp: message.createdTimestamp
                });
            });
            return message.channel.send('I have successfully reset all activity.')
        } else {

            const user = message.guild.members.cache.get(args[0])?.user || message.mentions.users.first();
            if (!user) { return message.reply('User not found!'); }

            let activity = await activityCollection.findOne({
                _id: user.id
            }, async (err, member) => {
                if (err) console.error(err)
                if (!member) {
                    const newMember = new activityCollection({
                        _id: user.id,
                        userTag: user.tag,
                        lastUpdate: message.createdTimestamp,
                        messages: 0,
                        voice: 0,
                        isVoice: false,
                        voiceJoinedStamp: message.createdTimestamp
                    });

                    await newMember.save()
                        .catch(err => console.error(err));
                }
            });

            if (activity) {
                await activity.updateOne({
                    _id: user.id,
                    userTag: user.tag,
                    lastUpdate: message.createdTimestamp,
                    messages: 0,
                    voice: 0,
                    isVoice: false,
                    voiceJoinedStamp: message.createdTimestamp
                });
            }

            message.channel.send(`I have resetted <@${user.id}>'s activity`);
        }
    },
};