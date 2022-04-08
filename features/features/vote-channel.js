const voteChannelSchema = require('@models/vote-channel-schema');

module.exports = async (client) => {
    //message logging

    client.on('messageCreate', async (message) => {
        if (!message.guild) return;

        let voteChannelCollection = voteChannelSchema;
        let channels = await voteChannelCollection.find({ serverID: message.guild.id })
        let flag = false;
        channels.forEach(voteChannelObj => {
            if (message.channel.id === voteChannelObj.voteChannelID) {
                flag = true;
            }
        });

        if (flag) {
            message.react('👍').catch(() => { });
            message.react('👎').catch(() => { });
        }
    })
}