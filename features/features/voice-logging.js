const vlogSchema = require('@models/vlog-schema');
const activitySchema = require('@models/server-activity-schema');

module.exports = async (client) => {
    //message logging

    client.on('voiceStateUpdate', async (state1, state2) => {
        if (state1.member.user.bot) return;

        //vlog stuff
        let vlogCollection = vlogSchema;
        let obj = await vlogCollection.findOne({ _id: state1.guild.id })

        if (!obj) return;
        let vlogChannel = state1.guild.channels.cache.get(obj.vlogChannelID);
        if (!vlogChannel) return;

        //activity stuff
        let activityCollection = activitySchema(state1.guild.id);
        let activity = await activityCollection.findOne({
            _id: state1.member.user.id
        })

        //disconnects from a channel
        if (state1.channel && (!state2.channel || (state1.guild.afkChannelId && state2.channelID == state1.guild.afkChannelId))) {
            //if it directly disconnected from afk channel, return
            if (state1.channelID == state1.guild.afkChannelId) return;

            let text = `:mute: **${state1.member.user.tag}** left **${state1.channel.name}** `;

            if (!activity || !activity.voiceJoinedStamp) {
                vlogChannel.send(text).catch(() => { });
                return
            }

            let time = Math.floor((Date.now() - activity.voiceJoinedStamp) / 1000);

            if (time < 60) text += `[Call time: **${time}s**]`;
            else if (time / 60 < 60) text += (`[Call time: **${Math.floor(time / 60)}m${Math.floor(time % 60)}s**]`);
            else text += (`[Call time: **${Math.floor(time / 60 / 60)}hr${Math.floor((time / 60) % 60)}m**]`);

            vlogChannel.send(text).catch(() => { })
        }

        //connects to channel
        else if (state2.channel && (!state1.channel || (state2.guild.afkChannelId && state1.channelID == state2.guild.afkChannelId))) {
            //if it directly connected to afk channel, return
            if (state2.channelID == state2.guild.afkChannelId) return;

            vlogChannel.send(`:loud_sound: **${state1.member.user.tag}** joined **${state2.channel.name}**`).catch(() => { });
        }

        //moved channels
        else if (state1.channelID !== state2.channelID) {
            vlogChannel.send(`:arrow_right: **${state1.member.user.tag}** moved from **${state1.channel.name}** to **${state2.channel.name}**`).catch(() => { })
        }
    })
}