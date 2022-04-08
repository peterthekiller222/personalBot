const math = require('mathjs');

module.exports = {
    name: 'calc',
    examples: ['5 + 6'],
    aliases: ['calculate'],
    description: 'Calculates some math for you.',
    minArgs: 1,
    expectedArgs: '{calculation}',
    async execute(message, args) {

        let { client } = message;
        
        let resp;
        let scope = client.mathScopes.get(message.author.id) || {};

        try {
            resp = math.evaluate(args.join(' '), scope).toString();
            if (`${resp}`.includes('function')) throw 'Only Number';
            await message.channel.send(resp)
            client.mathScopes.set(message.author.id, scope)
        } catch (e) {
            return message.reply('Invalid Calculation.');
        }

    },
};
