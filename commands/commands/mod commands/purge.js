module.exports = {
    name: 'purge',
    aliases: ['prune'],
    description: 'Bulk deletes messages.',
    expectedArgs: '{num}',
    minArgs: 1,
    maxArgs: 1,
    guildOnly: true,
    memberPermissions: ['MANAGE_MESSAGES'],
    clientPermissions: ['MANAGE_MESSAGES'],
    execute(message, args) {
        const amount = parseInt(args[0]);

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount < 2 || amount > 100) {
            return message.reply('you need to input a number between 2 and 100.');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            message.channel.send('There was an error while pruning these messages');
            console.error(err);
        });
    },
};