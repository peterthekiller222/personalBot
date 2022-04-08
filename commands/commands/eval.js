const { inspect } = require('util');

module.exports = {
    name: 'eval',
    description: 'specifically for testing',
    async execute(message, args) {
        if (message.author.id !== '333177159357169664') return;
        if (!args[0]) return;
        let { client } = message;

        try {
            if (args.join(' ').toLowerCase().includes('token') || args.join(' ').toLowerCase().includes('mongo')) return

            const code = args.join(' ');
            let evaled = eval(code);

            if (evaled instanceof Promise) {
                evaled = await evaled;
            }

            await message.channel.send(`\`\`\`js\n${inspect(evaled, { depth: 0 })}\`\`\``)

        } catch (e) {
            message.channel.send(`\`\`\`${e}\`\`\``)
        }

        return;
    },
};