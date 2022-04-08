const banWordSchema = require('@models/ban-word-schema');

module.exports = async (client) => {
    //message logging
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        let banWordCollection = banWordSchema
        let banWordObject = await banWordCollection.findOne({ _id: message.guild.id })

        if (!banWordObject) return

        let { banWords } = banWordObject
        banWords.forEach(word => {
            if (message.content.toLowerCase().includes(word.toLowerCase())) {
                message.delete().catch(() => { });
            }
        });
    })

}