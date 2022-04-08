const Discord = require('discord.js');

module.exports = {
    name: 'deafen',
    description: 'Deafens people in a call.',
    expectedArgs: '@user / all',
    guildOnly: true,
    minArgs: 1,
    maxArgs: 1,
    memberPermissions: ['DEAFEN_MEMBERS'],
    clientPermissions: ['DEAFEN_MEMBERS'],
    execute: (message, args) => {
        if (args[0] === 'all') {
            for (const channel of message.guild.channels.cache.values()) {
                if (channel.type == 'GUILD_VOICE') {
                    for (const member in channel.members.values()) {
                        member.voice.setDeaf(true);
                    }
                };
            };
            return message.channel.send(`I have deafened all possible members`);
        }

        let targetMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!targetMember) return message.reply('Member not found!');
        let user = targetMember.user;

        let flag = true;
        message.guild.channels.cache.map(element => element).forEach(channel => {
            if (channel.type == 'GUILD_VOICE') {
                channel.members.map(element => element).forEach(member => {
                    if (member.user == user) {
                        member.voice.setDeaf(true);
                        flag = false;
                    }
                });
            };
        });
        if (flag) return message.reply('User not found in the channels!')
        message.channel.send(`I have deafened <@${user.id}>`);
    },
};