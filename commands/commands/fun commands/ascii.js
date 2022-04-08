const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'ascii',
    description: 'Transforms text into big text.',
    expectedArgs: '{message}',
    minArgs: 1,

    async execute(message, args) {
        let response = await fetch(`https://artii.herokuapp.com/make?text=${encodeURIComponent(args.join(' '))}`);
        let text = await response.text();

        message.channel.send(`\`\`\`${text}\`\`\``).catch(err=>{
            message.channel.send("Sorry, can't asciify this text...")
        });
    },
};