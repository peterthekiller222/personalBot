const { inspect } = require('util');

module.exports = {
    name: 'eval2',
    description: 'specifically for testing',
    async execute(message, args) {
        if (message.author.id !== '333177159357169664') return;
        if (!args[0]) return;
        let { client } = message;

        try {
            if (args.join(' ').toLowerCase().includes('token') || args.join(' ').toLowerCase().includes('mongo')) return

            const code = args.join(' ');
            eval(code);

        } catch (e) {
            message.channel.send(`\`\`\`${e}\`\`\``)
        }

        return;
    },
};