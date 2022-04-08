const Discord = require('discord.js');

module.exports = {
    name: 'oldestusers',
    description: 'List the oldest users',
    guildOnly: true,
    execute: async (message, args) => {

        let members = await message.guild.members.fetch();
        let array = members.map(el => el);
        array = array.filter(member=>!member.user.bot)
        array.sort((a, b) => a.user.createdTimestamp < b.user.createdTimestamp ? -1 : 1)

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Oldest users in ${message.guild.name}`)
            .setFooter(`requested by ${message.author.tag}`)

        for (let i = 0; i < 10; i++) {
            let member = array[i];

            if (member) {
                let { user } = member;
                let daysCreated = Math.round((message.createdTimestamp - user.createdTimestamp) / 1000 / 60 / 60 / 24);
                
                embed.addField(`${member.user.tag}`, `Created at: \`${user.createdAt.toDateString()}\` (${daysCreated} days ago)`);
            }
        }
        
        message.channel.send({embeds: [embed]});
    },
};