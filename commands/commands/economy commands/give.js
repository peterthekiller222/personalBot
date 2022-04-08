const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'give',
    description: 'Gives someone money',
    minArgs: 2,
    expectedArgs: '@user {ammount}',
    guildOnly: true,
    async execute(message, args) {
        const economyCollection = economySchema;

        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        if (!member || member.user.bot) {
            return message.reply('invalid member')
        }

        var giver = await economyCollection.findOneAndUpdate(
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

        var receiver = await economyCollection.findOneAndUpdate(
            {
                _id: member.id
            },
            {
                $setOnInsert: { money: 0 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        giver = await economyCollection.findOneAndUpdate(
            {
                _id: message.author.id
            },
            {
                $setOnInsert: { money: 0 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        receiver = await economyCollection.findOneAndUpdate(
            {
                _id: member.id
            },
            {
                $setOnInsert: { money: 0 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        if (!giver || !receiver) return
        if (member.id === message.author.id) return message.reply('Why are you trying to give yourself money?')

        let ammount = parseInt(args[1]);
        if (args[1] === 'all') ammount = giver.money

        if (isNaN(ammount) || ammount < 0) return message.reply('That is not a valid amount')

        if (ammount > giver.money) return message.reply(`You don\'t have the money for that, you only have $${giver.money} in cash!`)

        await giver.updateOne({
            money: giver.money - ammount
        });

        await receiver.updateOne({
            money: receiver.money + ammount
        });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${member.displayName} has been gifted!`)
            .setDescription(`**${message.member.displayName}** has gifted **$${ammount}** to **${member.displayName}**`)
            .setColor('#0099ff')

        message.channel.send({embeds: [embed]})
    },
};
