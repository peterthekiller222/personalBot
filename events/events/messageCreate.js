const config = require('@root/config.json');
const prefix = config.prefix;
const commandBase = require('@root/commands/command-base');

module.exports = async (client, message) => {
    let { author, content, channel } = message;

    if (author.bot) return;
    content = content.toLowerCase();

    if(message.guild?.id == "512578878305337354" && message.content == "e tryhard"){
        message.channel.send("tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: tryhard :warning: ")
    }

    //prefixes and commands
    if (content.startsWith(prefix)) {
        commandBase(message);
        return;
    }

    //simple replies
    //rey
    const rey = ['REY IS INSANELY UGLY HOLY FUCK', 'Rey is a pedo', 'Rey? The failure of a human being?',
        'Rey is packing a tic-tac', 'Rey has iq of room temperature', 'Rey contains much stupid',
        'Rey put thermal paste under his cpu', 'Rey has a gay level 999', 'Rey is a big homo',
        'Pritten patil picked the wrong baby when adopting', 'Rey has big boobies',
        'Rey is a stinky', 'Rey is a curry muncher', 'Rey shoots up orphanages', 'Rey watched 300 naruto episodes in a week',
        'Rey is a weeb', 'Rey wants to fuck Tima', 'Rey got his league account banned', 'Ben chud', 'Rey wants to get pegged by Joe',
        'Rey is hardstuck plat', 'Rey you eat cow'];

    if ((message.guild?.id === '512578878305337354' || message.guild?.id === '684391250777866301' || message.guild?.id === '858704861164077076') && author.id === '395152698120339456' && (content.includes('cdn.discordapp.com') || content.includes('media.discordapp.net') || content.includes('tenor') || message.attachments.size > 0)) {
        message.reply('Not funny.').catch(() => { })
        channel.fetchWebhooks().then(async webhookCollection => {
            let foundHook = webhookCollection.find(hook => hook.name === 'oogie-boogie-mimic');
            if (!foundHook) {
                foundHook = await channel.createWebhook('oogie-boogie-mimic', avatarURL);
            }
            foundHook.send({ //esc
                content: "bot speaking fax", 
                username: message.guild.members.cache.get("333177159357169664").displayName,
                avatarURL: message.guild.members.cache.get("333177159357169664").user.displayAvatarURL()
            })
            foundHook.send({ //rey
                content: "arran stop it youre not funny", 
                username: message.guild.members.cache.get("512375511205543936").displayName,
                avatarURL: message.guild.members.cache.get("512375511205543936").user.displayAvatarURL()
            })
            // foundHook.send("arran please seek medical attention", { //kj
            //     username: message.guild.members.cache.get("811066698790338632").displayName,
            //     avatarURL: message.guild.members.cache.get("811066698790338632").user.displayAvatarURL()
            // })
            // foundHook.send("i know im not funny im sorry", { //arran
            //     username: message.guild.members.cache.get("395152698120339456").displayName,
            //     avatarURL: message.guild.members.cache.get("395152698120339456").user.displayAvatarURL()
            // })
            // foundHook.send("you keep saying that but why do keep posting such bad memes", { //rey
            //     username: message.guild.members.cache.get("512375511205543936").displayName,
            //     avatarURL: message.guild.members.cache.get("512375511205543936").user.displayAvatarURL()
            // })
            // foundHook.send("im only trying to compensate for my tiny dick with my broken sense of humour", { //arran
            //     username: message.guild.members.cache.get("395152698120339456").displayName,
            //     avatarURL: message.guild.members.cache.get("395152698120339456").user.displayAvatarURL()
            // })
            // foundHook.send("its not working out really well now is it?", { //esc
            //     username: message.guild.members.cache.get("333177159357169664").displayName,
            //     avatarURL: message.guild.members.cache.get("333177159357169664").user.displayAvatarURL()
            // })
            // foundHook.send("look i know im a failure of a human being stop it please im begging you", { //arran
            //     username: message.guild.members.cache.get("395152698120339456").displayName,
            //     avatarURL: message.guild.members.cache.get("395152698120339456").user.displayAvatarURL()
            // })
        }).catch(() => { })
        // await message.delete({ reason: 'arran made bad meme' }).catch(() => {})
    }

    // rey delete
    // if (message.author.id === '512375511205543936' && message.guild.id === '512578878305337354') {
    //     await message.delete().catch(() => { });
    //     return;
    // }

    if (content.replace(/[<@!>]/g, '') === client.user.id) {
        channel.send(`Type \`${prefix}help\` for some help`).catch(()=>{});
    }
};

