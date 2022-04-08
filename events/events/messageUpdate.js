const config = require('@root/config.json');
const prefix = config.prefix;
const commandBase = require('@root/commands/command-base');

module.exports = async (client, oldMessage, newMessage) => {

    if (oldMessage.author.bot) return;
    if(oldMessage.cleanContent === newMessage.cleanContent) return;

    if (oldMessage.guild) {
        const editSnipes = client.editSnipes.get(newMessage.channel.id) || [];
        editSnipes.unshift({
            oldContent: oldMessage.content,
            newContent: newMessage.content,
            author: newMessage.author,
            attachment: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null,
            date: new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })
        })
        editSnipes.splice(10);
        client.editSnipes.set(oldMessage.channel.id, editSnipes);
    }
};