const Discord = require('discord.js');

module.exports = {
    name: 'oldestmembers',
    description: 'List the oldest members',
    guildOnly: true,
    execute: async (message, args) => {

        let members = await message.guild.members.fetch();
        let array = members.map(el => el);
        array = array.filter(member => !member.user.bot)
        array.sort((a, b) => a.joinedTimestamp < b.joinedTimestamp ? -1 : 1)

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Oldest members in ${message.guild.name}`)
            .setFooter(`requested by ${message.author.tag}`)

        for (let i = 0; i < 10; i++) {
            let member = array[i];

            if (member) {
                let daysJoined = Math.round((message.createdTimestamp - member.joinedTimestamp) / 1000 / 60 / 60 / 24);

                embed.addField(`${member.user.tag}`, `Joined at: \`${member.joinedAt.toDateString()}\` (${daysJoined} days ago)`);
            }
        }

        message.channel.send({embeds: [embed]});
    },
};