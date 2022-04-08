const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'rule34',
    aliases: ['r34'],
    description: 'Searches rule 34.',
    minArgs: 1,
    expectedArgs: '{tag}',
    cooldown: 2,
    nsfw: true,
    async execute(message, args) {

        let response = await fetch(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${args.join('_')}`, {
            method: 'GET',
            headers:
                { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36' }
        });
        let text = await response.text();

        let result = text.split('"').filter((element, index) => {
            return element.startsWith('https') && text.split('"')[index - 1] === ` file_url=` && !element.endsWith('mp4');
        })
        // console.log(result)

        if (result.length === 0) {
            return message.reply('No searches found...')
        }

        let pick = result[Math.floor(Math.random() * result.length)];

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setImage(pick)
            .setFooter(`Requested by ${message.author.tag}`)

        message.channel.send({ embeds: [embed] });
    },
};