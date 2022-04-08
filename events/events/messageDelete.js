const config = require('@root/config.json');
const prefix = config.prefix;
const commandBase = require('@root/commands/command-base');

module.exports = async (client, message) => {

    // if (message.author.id === client.user.id && message.content.includes('not funny.') && message.content.includes('395152698120339456')) {
    //     message.channel.send('<@395152698120339456>, stop deleting my message, you\'re still not funny.');
    // }

    if (message.author.bot) return;

    if (message.guild) {
        const snipes = client.snipes.get(message.channel.id) || [];
        snipes.unshift({
            content: message.content,
            author: message.author,
            attachment: message.attachments.first() ? message.attachments.first().proxyURL : null,
            date: new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })
        })
        snipes.splice(100);
        client.snipes.set(message.channel.id, snipes);
    }
};