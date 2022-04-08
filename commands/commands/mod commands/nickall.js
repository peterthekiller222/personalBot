module.exports = {
    name: 'nickall',
    description: 'Nicknames everyone.',
    expectedArgs: '{name}',
    guildOnly: true,
    memberPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_NICKNAMES'],
    cooldown: 10,
    async execute(message, args) {

        if (args.length === 0) {
            message.channel.send(`changing all possible users to default`);
        } else {
            message.channel.send(`changing all possible users to \`${args.join(' ')}\``);
        }
        message.channel.send('If its a large server, it may take a minute or so...')
        let reply = await message.channel.send(`\`Fetching members...\``);
        let fail = await message.channel.send('Failed to change 0 members due to permission errors')

        let members = await message.guild.members.fetch();
        let count = 0;
        let failed = 0;
        members.each(async member => {
            await member.setNickname(args.join(' ')).then(thing => {
                count++;
                reply.edit(`\`${count} / ${members.map(e => e).length} done\``)
            }).catch(err => {
                if (err.message == 'Missing Permissions') {
                    failed++;
                    fail.edit(`Failed to change ${failed} members due to permission errors`)
                }
            })
        })
    },
};