module.exports = {
    name: 'ask',
    examples: ['should I do my homework?'],
    aliases: ['8ball'],
    description: 'Answers your question.',
    expectedArgs: '{question}',
    minArgs: 1,
    execute(message, args) {
        const replies = [
            'It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes – definitely',
            'You may rely on it',

            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',

            'Reply hazy, try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',

            ' Don\'t count on it',
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful',
        ]

        message.reply(replies[Math.floor(Math.random() * replies.length)]);
    },
};