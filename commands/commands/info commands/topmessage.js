const Discord = require('discord.js')

module.exports = {
    name: 'topmessage',
    description: 'Links the top message.',
    guildOnly: true,
    async execute(message, args) {
        let { guild, channel } = message;
        channel.messages.fetch({
            around: 0
        }).then(col => {
            let oldMessage = col.last()

            let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Oldest Message of ${channel.name}`)
                .setDescription(`[Click this link to jump to message](https://discord.com/channels/${guild.id}/${channel.id}/${oldMessage.id})`)

            message.channel.send({embeds: [embed]})
        }).catch((err) => {
            message.channel.send(`Unable to fetch oldest message`)
        })
    },
};