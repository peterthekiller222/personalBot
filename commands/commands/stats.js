const Discord = require('discord.js');

const mongoose = require('mongoose')
const activityDB = mongoose.connection.useDb('Activity');

module.exports = {
    name: 'stats',
    aliases: ['info'],
    description: 'Info on this bot.',
    execute: async (message, args) => {
        if (message.author.id !== '333177159357169664') return;
        let embed;
        let { client } = message;

        embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Oogie Boogie Website`)
            .setURL('https://oogieboogiedashboard.herokuapp.com/')
            .setDescription('[Help Server](https://discord.com/invite/ph5DVfFmeX) | [Website](https://oogieboogiedashboard.herokuapp.com/)')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: 'Created by:', value: `ESC#3777`, inline: false },
                { name: 'Created on:', value: `${client.user.createdAt.toDateString()}`, inline: false },
                { name: 'Servers:', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Total Channels:', value: `${client.channels.cache.size}`, inline: true },
                // { name: 'Total Server members:', value: `${serverMembers}`, inline: false },
                { name: 'Commands:', value: `${client.commands.size}`, inline: true },
            )
        let uptime = client.uptime;
        let days = Math.floor(uptime / 1000 / 60 / 60 / 24)
        uptime -= days * 1000 * 60 * 60 * 24;

        let hours = Math.floor(uptime / 1000 / 60 / 60)
        uptime -= hours * 1000 * 60 * 60;

        let minutes = Math.floor(uptime / 1000 / 60)
        uptime -= minutes * 1000 * 60;

        let seconds = Math.floor(uptime / 1000)
        uptime -= seconds * 1000;

        embed.addFields(
            { name: 'Uptime:', value: `Last restarted: \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``, inline: false },
        )

        let stats1 = await mongoose.connection.db.stats();
        let stats2 = await activityDB.db.stats();
        let memory = stats1.indexSize + stats1.dataSize + stats2.indexSize + stats2.dataSize;

        embed.addField(
            'Database Storage:',
            `\`${Math.round(memory / 100000) / 10}mb / 500mb\``,
            false
        )

        message.channel.send({embeds: [embed]});
    },
};