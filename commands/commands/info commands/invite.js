let Discord = require('discord.js')

module.exports = {
    name: 'invite',
    description: 'The invite link for this bot',
    async execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Invite link')
            .setDescription('[click this link to invite me](https://discord.com/oauth2/authorize?client_id=789960873203990598&permissions=0&scope=bot)')

        message.channel.send({embeds: [embed]})
    },
};