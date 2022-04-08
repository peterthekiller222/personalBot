const Discord = require('discord.js');

module.exports = {
    name: 'disconnect',
    aliases: ['voicekick', 'vkick'],
    description: 'Disconnects people in a call.',
    expectedArgs: '@user / all',
    guildOnly: true,
    minArgs: 1,
    maxArgs: 1,
    memberPermissions: ['MOVE_MEMBERS'],
    clientPermissions: ['MOVE_MEMBERS'],
    execute: (message, args) => {
        if (args[0] === 'all') {
            message.guild.channels.cache.map(element => element).forEach(channel => {
                if (channel.type == 'GUILD_VOICE') {
                    channel.members.map(element => element).forEach(member => {
                        member.voice.disconnect();
                    });
                };
            });
            return message.channel.send(`I have disconnected all possible members`);
        }

        let targetMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!targetMember) return message.reply('Member not found!');
        let user = targetMember.user;

        let flag = true;
        message.guild.channels.cache.map(element => element).forEach(channel => {
            if (channel.type == 'GUILD_VOICE') {
                channel.members.map(element => element).forEach(member => {
                    if (member.user == user) {
                        member.voice.disconnect();
                        flag = false;
                    }
                });
            };
        });
        if (flag) return message.reply('User not found in voice channels!')
        message.channel.send(`I have disconnected <@${user.id}>`);
    },
};