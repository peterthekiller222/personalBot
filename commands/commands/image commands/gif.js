const fetch = require('node-fetch');

module.exports = {
    name: 'gif',
    cooldown: 1,
    examples:['cute cat'],
    description: 'Shows a gif',
    expectedArgs: '{tag}',
    minArgs: 1,
    clientPermissions: ['ATTACH_FILES'],
    async execute(message, args) {
        let url = `https://g.tenor.com/v1/search?q=${args.join(' ')}&key=${process.env.TENOR_KEY}&contentfilter=low`;
        let response = await fetch(url);
        let json = await response.json();
        let results = json.results;

        if(!results?.length) return message.reply("Unable to find a gif for that!")

        let random = results[Math.floor(Math.random() * results.length)];
        message.channel.send(random.url)
    },
};