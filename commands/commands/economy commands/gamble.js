const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'gamble',
    aliases: ['coinflip'],
    description: 'Gamble for some money',
    expectedArgs: '{ammount} / all',
    guildOnly: true,
    minArgs: 1,
    async execute(message, args) {
        const economyCollection = economySchema;

        let obj = await economyCollection.findOneAndUpdate(
            {
                _id: message.author.id
            },
            {
                $setOnInsert: { bank: 0 },
                $inc: { money: 0 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        let ammount = parseInt(args[0]);

        //if wanna gamble all
        if (args[0] === 'all') ammount = obj.money

        if (isNaN(ammount) || ammount < 0) return message.reply('That is not a valid ammount');
        if (ammount == 0) return message.reply('You have nothing to gamble!');

        if (obj && ammount > obj.money) return message.reply('You don\' have the money for this!')

        // if(obj && ammount < obj.money / 10) return message.reply('You can only gamble a minimum of 10% of your money')

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')

        if (Math.random() > 0.5) {
            await obj.updateOne({
                money: obj.money + ammount
            });

            embed
                .setTitle(`Heads!`)
                .setDescription(`**${message.member.displayName}** has gained **$${ammount}**!`)
        } else {
            await obj.updateOne({
                money: obj.money - ammount
            });

            embed
                .setTitle(`Tails!`)
                .setDescription(`**${message.member.displayName}** has lost **$${ammount}**!`)
        }




        message.channel.send({embeds: [embed]})
    },
};
