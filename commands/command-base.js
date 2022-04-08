let recentlyRan = []

module.exports = message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    let { client, guild, member, author } = message;

    const commandName = args.shift().toLowerCase();
    let command;
    //checks if the command exists
    for (const element of client.commands.values()) {
        if (commandName === element.name || (element.aliases && element.aliases.includes(commandName))) {
            command = element;
        }
    }

    if (!command) return;

    //if it doesn't have perms to send in the channel
    if (message.channel.type !== 'dm' && !message.channel.permissionsFor(message.guild.members.cache.get(client.user.id)).has('SEND_MESSAGES')) {
        return;
    }

    // if (message.author.id == '249148390527598592') {
    //     return message.reply('Sorry, I\'m unable to run that command for you.');
    // }

    //default properties of a command
    let {
        name,
        description,
        expectedArgs,
        guildOnly = false,
        minArgs = 0,
        maxArgs = null,
        memberPermissions = [],
        clientPermissions = [],
        cooldown = -1,
        nsfw = false,
        execute
    } = command;

    //error traps if its meant only for server
    if (guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    //checks if person has permissions
    if (message.channel.type !== 'dm' && memberPermissions) {
        const member = message.member;
        let missingPerms = [];
        let flag = false;
        memberPermissions.forEach((item, index) => {
            if (!message.channel.permissionsFor(member).has(item)) {
                flag = true;
                missingPerms.push(item);
            }
        })
        if (flag) {
            return message.reply(`You require the following permissions: \`${missingPerms.join(' ')}\``);
        }
    }

    //error traps for bot perms
    if (message.channel.type !== 'dm' && clientPermissions) {
        const selfMember = message.guild.members.cache.get(message.client.user.id);
        let missingPerms = [];
        let flag = false;
        clientPermissions.forEach((item, index) => {
            if (!message.channel.permissionsFor(selfMember).has(item)) {
                flag = true;
                missingPerms.push(item);
            }
        })
        if (flag) {
            return message.reply(`I require the following permissions: \`${missingPerms.join(' ')}\``);
        }
    }

    if (message.channel.type !== 'dm' && nsfw) {
        if (!message.channel.nsfw) return message.reply('This is not an NSFW channel');
    }

    //ensure command isn't ran too frequently
    let cooldownString = `${author.id}-${name}`;

    //checks if command is on cooldown
    let flag = false;
    let timeLeft = 0;
    recentlyRan.forEach(element => {
        if (element.includes(cooldownString)) {
            flag = true;
            let temp = element.split('-')
            timeLeft = parseInt(temp[temp.length - 1]) - Date.now()
        }
    })

    if (cooldown > 0 && flag) {
        timeLeft = Math.round(timeLeft / 1000)
        if (timeLeft > 60) {
            message.reply(`You can\'t use that command so soon, time left is \`${Math.floor(timeLeft / 60)} mins.\``)
            return
        }

        message.reply(`You can\'t use that command so soon, time left is \`${timeLeft} secs.\``)
        return
    }

    //error traps if there are no args
    if (args.length < minArgs || (maxArgs !== null && maxArgs < args.length)) {
        return message.reply(`Incorrect syntax! Use \`${prefix}${commandName} ${expectedArgs}\``);
    }

    if (cooldown > 0) {
        recentlyRan.push(`${cooldownString}-${Date.now() + cooldown * 1000}`)
        setTimeout(() => {
            recentlyRan = recentlyRan.filter((string) => {
                return !string.includes(cooldownString)
            })
        }, 1000 * cooldown);
    }

    try {
        let text = `In **${message.guild ? message.guild.name : 'dm'}** in **#${message.channel.name ? message.channel.name : 'dm'}** by **${message.author.tag}**: \`${prefix}${commandName} ${args.join(' ')}\``;
        // console.log(text)
        client.guilds.cache.get('616347460679368731').channels.cache.get('809573431195729940').send(text);
        execute(message, args);
    } catch (error) {
        console.log(`THERE WAS AN ERROR BUT WAS CATCHED: ${error.stack}`);
        message.reply('there was an error trying to execute that command!');
    }
}