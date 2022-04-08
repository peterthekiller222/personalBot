const nothingChannelSchema = require('@models/nothing-channel-schema');

module.exports = async (client) => {
    //message logging

    client.on('messageCreate', async (message) => {
        if (!message.guild) return;

        let nothingChannelCollection = nothingChannelSchema;
        let channels = await nothingChannelCollection.find({ serverID: message.guild.id })
        let flag = false;
        channels.forEach(nothingChannelObj => {
            if (message.channel.id === nothingChannelObj.nothingChannelID) {
                flag = true;
            }
        });

        if (flag) {
            message.delete().catch(() => { });
        }
    })
}