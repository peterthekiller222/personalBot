const Discord = require("discord.js");
const economySchema = require('@models/economy-schema')

module.exports = {
    name: 'bal',
    aliases: ['balance'],
    description: 'Gets your balance',
    expectedArgs: '@user / top',
    guildOnly: true,
    async execute(message, args) {
        const economyCollection = economySchema;

        if (args[0] === 'top') {
            let members = [];
            //all activities of every member in activityList
            (await economyCollection.find()).forEach(member => {
                if (message.guild.members.cache.get(member._id)) {
                    members.push(member);
                }
            })

            members.sort((a, b) => a.money + a.bank > b.money + b.bank ? -1 : 1)
            members.splice(10)
            let list = members.map(member => {
                return `**${message.guild.members.cache.get(member._id).displayName}**: $${member.money + member.bank}`
            })

            let embed = new Discord.MessageEmbed()
                .setTitle(`Richest people in ${message.guild.name}`)
                .setDescription(list.join('\n'))
                .setColor('#0099ff')

            message.channel.send({embeds: [embed]})
            return;
        }

        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;
        //adds money
        let obj = await economyCollection.findOneAndUpdate(
            {
                _id: member.id
            },
            {
                $setOnInsert: { money: 0, bank: 0 },
            },
            {
                upsert: true
            }
        ).exec()

        let embed = new Discord.MessageEmbed()
            .setTitle(`${member.displayName}'s money`)
            .setDescription(`Bank account: **${obj ? obj.bank : 0} dollars** \n Cash: **${obj ? obj.money : 0} dollars**`)

        message.channel.send({embeds: [embed]})
    },
};