const Discord = require('discord.js');
const banwordSchema = require('@models/ban-word-schema');

module.exports = {
    name: 'banword',
    examples: ['remove cringe', 'cringe'],
    description: 'Set a list of banned words',
    expectedArgs: '{word} / remove {word}',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 2,
    memberPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_MESSAGES'],
    execute: async (message, args) => {
        let banWordCollection = banwordSchema;

        //just shows information
        if (args.length === 0) {
            let banWordObject = await banWordCollection.findOne({ _id: message.guild.id })

            if (banWordObject?.banWords?.length != 0) {
                let text = '';
                banWordObject.banWords.forEach(word => {
                    text += `\`${word}\`\n`
                });

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Banned words in ${message.guild.name}`)
                    .setDescription(text)
                    .setColor('#0099ff')

                message.channel.send({ embeds: [embed] })
            } else {
                message.channel.send(`Set up a banned word using \`e banword {word}\``)
            }
            return;
        }

        // removes a banword
        else if (args[0] === 'remove') {
            removingBanWord = args[1]

            if (!args[1]) {
                return message.reply('This is not a valid word to remove!')
            }

            let banWordsObject = await banWordCollection.findOneAndUpdate(
                {
                    _id: message.guild.id
                },
                {
                    $setOnInsert: { banWords: [] }
                },
                {
                    new: true,
                    upsert: true,
                })

            let { banWords } = banWordsObject
            if (!banWords.includes(args[1])) return message.reply(`\`${args[1]}\` is not a banned word in this server!`)
            banWords = banWords.filter(item => item !== args[1])

            await banWordsObject.updateOne({
                banWords: banWords
            })

            message.channel.send(`Removed banned word ${args[1]}.`);
            return;
        }


        let banWordsObject = await banWordCollection.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                $setOnInsert: { banWords: [] }
            },
            {
                new: true,
                upsert: true,
            })

        let { banWords } = banWordsObject

        let double = false;
        banWords.forEach(word => {
            if (word === args[0]) {
                double = true;
            }
        })

        if (double) {
            return message.reply(`\`${args[0]}\` is already a banned word!`)
        }

        banWords.push(args[0])

        await banWordsObject.updateOne({
            banWords: banWords
        })

        message.channel.send(`Successfully added \`${args[0]}\` as a banned word!`)
    },
};