const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'neko',
    description: 'Sends a neko!',
    nsfw: true,
    
    async execute(message, args) {

        let response = await fetch('https://nekos.life/api/v2/img/lewd');
        let json = await response.json();

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setImage(json.url)
            .setFooter(`Requested by ${message.author.tag}`)

        message.channel.send({embeds: [embed]});
    },
};