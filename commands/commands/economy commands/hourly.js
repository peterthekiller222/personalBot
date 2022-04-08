const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'hourly',
    description: 'Your hourly reward',
    guildOnly: true,
    cooldown: 60 * 60,
    async execute(message, args) {
        const economyCollection = economySchema;

        await economyCollection.findOneAndUpdate(
            {
                _id: message.author.id
            },
            {
                $setOnInsert: { bank: 0 },
                $inc: { money: 500 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        let embed = new Discord.MessageEmbed()
            .setTitle(`${message.member.displayName} has collected his hourly reward!`)
            .setDescription(`You have gained **$500**`)
            .setColor('#0099ff')

        message.channel.send({embeds: [embed]})
    },
};