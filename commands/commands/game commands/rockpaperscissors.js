const Discord = require('discord.js');

const decisions = ['rock', 'paper', 'scissors'];

module.exports = {
    name: 'rockpaperscissors',
    aliases: ['rps'],
    description: 'Plays a game of rock paper scissors!',
    expectedArgs: '@user',
    minArgs: 1,
    maxArgs: 1,
    guildOnly: true,
    execute: async (message, args) => {
        let member = message.mentions.members.first();

        if (!member) return message.reply('Invalid member')
        if (member.user.bot) return message.reply('You can\'t do this to a bot')
        if (member.id === message.author.id) return message.reply('You can\'t challenge yourself!')

        //setup
        let authorChoice = '';
        let memberChoice = '';

        let embed = new Discord.MessageEmbed()
            .setTitle(`${message.member.displayName} has challenged ${member.displayName}!`)
            .setColor('#0099ff')
            .setDescription('A rock paper scissors battle is in progress...')
            .addFields(
                {
                    name: `${message.member.displayName}`,
                    value: `${authorChoice ? decisions[authorChoice] : 'Unsubmitted...'}`
                },
                {
                    name: `${member.displayName}`,
                    value: `${memberChoice ? decisions[memberChoice] : 'Unsubmitted...'}`
                }
            )

        let embedMessage = await message.channel.send({ embeds: [embed] })

        //asks the question now in the dms
        let questionEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Rock Paper Scissors!')
            .setDescription('Type either \`rock\`, \`paper\`, \`scissors\` to submit your decision...');

        const authorDM = await message.author.createDM();
        const memberDM = await member.user.createDM();

        await message.author.send({ embeds: [questionEmbed] });
        await member.user.send({ embeds: [questionEmbed] });

        let updateDecision = (m) => {
            let dmMessage = m.first()
            if (!dmMessage) {
                return;
            }

            let content = dmMessage.content.trim().toLowerCase()

            dmMessage.channel.send(`Your choice of \`${content}\` has been submitted`)

            if (dmMessage.author.id === message.author.id) {
                authorChoice = decisions.indexOf(content);
            } else if (dmMessage.author.id === member.id) {
                memberChoice = decisions.indexOf(content);
            }
            // else {
            //      console.log('THIS IS NOT MEANT TO HAPPEN')
            // }

            let editedEmbed;

            if (authorChoice !== '' && memberChoice !== '') {
                let result = (authorChoice - memberChoice + 3) % 3;
                let description;
                if (result === 1) {
                    description = `${message.member.displayName} has won!`
                } else if (result === 2) {
                    description = `${member.displayName} has won!`
                } else {
                    description = `It is a draw!`
                }
                editedEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${message.member.displayName} has challenged ${member.displayName}!`)
                    .setDescription(description)
                    .addFields(
                        {
                            name: `${message.member.displayName}`,
                            value: `${decisions[authorChoice]}`
                        },
                        {
                            name: `${member.displayName}`,
                            value: `${decisions[memberChoice]}`
                        }
                    )

            } else {
                editedEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${message.member.displayName} has challenged ${member.displayName}!`)
                    .setDescription(`A rock paper scissors battle is in progress...`)
                    .addFields(
                        {
                            name: `${message.member.displayName}`,
                            value: `${authorChoice !== '' ? 'Submitted...' : 'Unsubmitted...'}`
                        },
                        {
                            name: `${member.displayName}`,
                            value: `${memberChoice !== '' ? 'Submitted...' : 'Unsubmitted...'}`
                        }
                    )
            }
            embedMessage.edit({ embeds: [editedEmbed] });
        }

        const filter = m => {
            //do filter stuff
            let content = m.content.trim().toLowerCase();
            return content === 'rock' || content === 'paper' || content === 'scissors';
        }

        const authorCollector = new Discord.MessageCollector(authorDM, {
            filter,
            time: 1000 * 60 * 2,
            max: 1
        })

        const memberCollector = new Discord.MessageCollector(memberDM, {
            filter,
            time: 1000 * 60 * 2,
            max: 1
        })

        authorCollector.on('end', updateDecision);
        memberCollector.on('end', updateDecision);
    },
};