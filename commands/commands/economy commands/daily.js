const Discord = require("discord.js");
const dailyRewardsSchema = require('@models/daily-rewards-schema')
const economySchema = require('@models/economy-schema')

let claimedCache = []

const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 1000 * 10 * 60);
}
clearCache();

module.exports = {
    name: 'daily',
    description: 'Gets your daily reward',
    guildOnly: true,
    cooldown: 60*60*24,
    async execute(message, args) {
        const { guild, member } = message;
        const { id } = member;

        if (claimedCache.includes(id)) {
            message.reply('You have already claimed your daily rewards.');
            return
        }

        const obj = { userID: id }

        const dailyRewardsCollection = dailyRewardsSchema;
        const results = await dailyRewardsCollection.findOne(obj)

        if (results) {
            const then = new Date(results.updatedAt).getTime();
            const now = new Date().getTime();

            const diffTime = now - then;
            const diffDays = Math.floor(diffTime / 1000 / 60 / 60 / 24);

            let time = Math.floor(diffTime / 1000)
            let text = ''

            let neededTime = (60 * 60 * 24) - time;

            if (neededTime < 60) text += `${neededTime}`;
            else if (neededTime / 60 < 60) text += (`${Math.floor(neededTime / 60)}m${Math.floor(neededTime % 60)}s`);
            else text += (`${Math.floor(neededTime / 60 / 60)}hr${Math.floor((neededTime / 60) % 60)}m`);

            if (diffDays >= 1) {
                giveMoney(id, message)
            } else {
                message.reply(`You have already claimed your daily rewards, time left: **${text}**`);
            }

            return
        }

        await dailyRewardsCollection.findOneAndUpdate(obj, obj, { upsert: true })

        giveMoney(id, message)
    },
};

const giveMoney = async (id, message) => {
    const economyCollection = economySchema;
    claimedCache.push(id)

    await economyCollection.findOneAndUpdate(
        {
            _id: id
        },
        {
            $setOnInsert: { bank: 0 },
            $inc: { money: 2000 }
        },
        {
            new: true,   // return new doc if one is upserted
            upsert: true // insert the document if it does not exist
        })

    let embed = new Discord.MessageEmbed()
        .setTitle(`${message.member.displayName} has claimed their daily reward!`)
        .setDescription(`**${message.member.displayName}** has gained $2000`)
        .setColor('#0099ff')

    message.channel.send({embeds: [embed]})
}
