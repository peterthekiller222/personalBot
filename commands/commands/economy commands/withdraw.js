const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'withdraw',
    description: 'Withdraws your money',
    minArgs: 1,
    expectedArgs: '{ammount}',
    guildOnly: true,
    async execute(message, args) {
        const economyCollection = economySchema;

        var person = await economyCollection.findOneAndUpdate(
            {
                _id: message.author.id
            },
            {
                $setOnInsert: { money: 0, bank: 0 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        if (!person) return message.reply('Nothing to withdraw!')

        let ammount = parseInt(args[0]);
        if (args[0] === 'all') ammount = person.bank

        if (isNaN(ammount) || ammount < 0) return message.reply('That is not a valid amount')

        if (ammount > person.bank) return message.reply('You don\'t have the money for that!')

        await person.updateOne({
            money: person.money + ammount,
            bank: person.bank - ammount
        });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${message.member.displayName} has withdrew!`)
            .setDescription(`**$${ammount}** has been withdrawn from your bank account`)
            .setColor('#0099ff')

        message.channel.send({embeds: [embed]})
    },
};