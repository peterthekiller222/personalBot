const activitySchema = require('@models/server-activity-schema');
const highestVoiceSchema = require('@models/vlog-highest-schema');
const fetch = require('node-fetch');

module.exports = async (client) => {
    //message logging
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (message.guild) {
            let activityCollection = activitySchema(message.guild.id);

            await activityCollection.findOneAndUpdate(
                {
                    _id: message.author.id
                },
                {
                    $setOnInsert: {
                        _id: message.author.id,
                        userTag: message.author.tag,
                        lastUpdate: message.createdTimestamp,
                        voice: 0,
                        isVoice: false,
                        voiceJoinedStamp: message.createdTimestamp
                    },
                    $inc: {
                        messages: 1
                    }
                },
                {
                    upsert: true,
                }
            )
        }
    })

    //voice logging
    client.on('voiceStateUpdate', async (state1, state2) => {
        if (state1.member.user.bot) return;

        //activity stuff
        let activityCollection = activitySchema(state1.guild.id);
        let activity = await activityCollection.findOneAndUpdate(
            {
                _id: state1.member.user.id
            },
            {
                $setOnInsert: {
                    _id: state1.member.id,
                    userTag: state1.member.user.tag,
                    lastUpdate: Date.now(),
                    messages: 0,
                    voice: 0,
                    isVoice: false,
                    voiceJoinedStamp: ``
                }
            },
            {
                upsert: true,
            }
        );

        if (!activity) {
            activity = await activityCollection.findOne({
                _id: state1.member.id
            });
        }

        if (!activity) {
            // console.log(`Couln't get activity...`)
            return;
        }

        //connects to channel
        if (state2.channel && (!state1.channel || (state2.guild.afkChannelId && state1.channelID == state2.guild.afkChannelId))) {
            //if it directly connected to afk channel, return
            if (state2.channelID == state2.guild.afkChannelId) return;

            await activity.updateOne({
                voiceJoinedStamp: Date.now(),
                isVoice: true
            });
            //console.log(state2.guild.afkChannelId, state1.channelID, state2.guild.afkChannelId)

        }

        //disconnects from a channel
        if (state1.channel && (!state2.channel || (state1.guild.afkChannelId && state2.channelID == state1.guild.afkChannelId))) {
            //if it directly disconnected from afk channel, return
            if (state1.channelID == state1.guild.afkChannelId) return;
            if (activity.isVoice == true) {

                let callEnd = Date.now()
                if (activity.lastUpdate === ``) {
                    await activity.updateOne({
                        lastUpdate: Date.now(),
                    });
                }
                let duration = Math.floor((callEnd - activity.voiceJoinedStamp) / 1000);

                await activity.updateOne({
                    voice: activity.voice + duration,
                    isVoice: false
                });

                //highest voice
                let highestVoiceCollection = highestVoiceSchema;
                let highestVoice = await highestVoiceCollection.findOne({ _id: state1.guild.id })

                //HIGHEST VOICE IS IN SECONDS
                if (!highestVoice || (highestVoice && highestVoice.time < duration)) {
                    highestVoiceCollection.findOneAndUpdate(
                        {
                            _id: state1.guild.id
                        },
                        {
                            _id: state1.guild.id,
                            highestMemberID: state1.member.id,
                            time: duration,
                        },
                        {
                            upsert: true,
                        }
                    ).exec()
                }
            }
        }
    })
}