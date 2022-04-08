const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'rob',
    description: 'Robs someone',
    minArgs: 1,
    expectedArgs: '@user',
    guildOnly: true,
    cooldown: 10 * 60,
    async execute(message, args) {
        const economyCollection = economySchema;

        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        if (!member || member.user.bot) {
            return message.reply('invalid member')
        }

        let stealPercentage = Math.round(Math.random() * 100) / 100

        var stealer = await economyCollection.findOneAndUpdate(
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

        var victim = await economyCollection.findOneAndUpdate(
            {
                _id: member.id
            },
            {
                $setOnInsert: { money: 0, bank: 0 }
            },
            {
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            })

        stealer = await economyCollection.findOneAndUpdate(
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

        victim = await economyCollection.findOneAndUpdate(
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

        if (!victim || !stealer) return
        if (member.id === message.author.id) return message.reply('Why are you trying to give yourself money?')

        var stolen = Math.round(victim.money * stealPercentage);

        await victim.updateOne({
            money: victim.money - stolen
        });

        await stealer.updateOne({
            money: stealer.money + stolen
        });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${member.displayName} has been robbed`)
            .setDescription(`**${message.member.displayName}** has robbed **$${stolen}** from **${member.displayName}**`)
            .setColor('#0099ff')

        message.channel.send({embeds: [embed]})
    },
};