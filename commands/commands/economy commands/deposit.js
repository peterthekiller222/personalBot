const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    description: 'Deposits your money',
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

        if (!person) return message.reply('Nothing to deposit!')

        let ammount = parseInt(args[0]);
        if (args[0] === 'all') ammount = person.money

        if (isNaN(ammount) || ammount < 0) return message.reply('That is not a valid amount')

        if (ammount > person.money) return message.reply('You don\'t have the money for that!')

        await person.updateOne({
            money: person.money - ammount,
            bank: person.bank + ammount
        });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${message.member.displayName} has deposited!`)
            .setDescription(`**$${ammount}** has been added to your bank account`)
            .setColor('#0099ff')

        message.channel.send({embeds: [embed]})
    },
};