const Discord = require('discord.js');
const timeoutSchema = require('@models/timeout-schema');

module.exports = {
    name: 'ismuted',
    aliases: ['muteinfo'],
    description: 'Checks if a person is muted',
    expectedArgs: '@user / {user id}',
    guildOnly: true,
    minArgs: 1,
    memberPermissions: ['MUTE_MEMBERS'],
    async execute(message, args) {
        let timeoutCollection = timeoutSchema;

        const id = args[0].replace(/[<@!>]/g, '');

        const members = await message.guild.members.fetch();
        const target = members.get(id);
        const isInDiscord = !!target;

        const currentMute = await timeoutCollection.findOne(
            {
                userId: id,
                guildId: message.guild.id,
                current: true,
            }
        ).clone()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Mute info for ${target ? target.user.tag : id}`, target ? target.user.displayAvatarURL() : '')
            .addField('Currently muted', currentMute ? 'Yes' : 'No')
            .addField('Is in discord?', isInDiscord ? 'Yes' : 'No')

        if (currentMute) {
            const date = currentMute.expires

            embed.addField('Muted by', `<@${currentMute.staffId}>`)
            embed.addField('Muted for', `${currentMute.reason}`)
            embed.addField('Muted until', `${date.toLocaleString()} GMT`)
        }

        message.channel.send({embeds: [embed]})
    },
};