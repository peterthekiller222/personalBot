const Discord = require('discord.js');
const config = require('@root/config.json');
prefix = config.prefix;

const listCommands = require('../../list-commands')
const categoryNames = ['config', 'fun', 'info', 'stats', 'mod', 'voice', 'image', 'game', 'economy'];

module.exports = {
    name: 'help',
    description: 'Help with commands.',

    execute(message, args) {
        const embed = new Discord.MessageEmbed().setColor('#0099ff')

        //help on a specific category
        let allCommands = true;
        categoryNames.forEach(category => {
            if (args[0] === category) {
                allCommands = false;
                let list = makeCommandList(listCommands(`commands/${category} commands`))
                embed
                    .setColor('#0099ff')
                    .setURL('https://oogieboogiedashboard.herokuapp.com/commands')
                    .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} commands`)
                    .setDescription(`A collection of all the ${category} commands and descriptions`)
                    .addFields(
                        {
                            name: '\u200B', value: list
                        }
                    );

                return message.channel.send({ embeds: [embed] });
            }
        })
        if (!allCommands) return;

        let command;
        let commandName = args[0];
        if (commandName) {
            commandName = commandName.toLowerCase();
            for (const element of message.client.commands.values()) {
                if (commandName === element.name || (element.aliases && element.aliases.includes(commandName))) {
                    command = element;
                }
            }
        }

        //help on a specific command
        if (command) {
            let {
                name,
                examples,
                aliases = [],
                description,
                expectedArgs,
                guildOnly = false,
                minArgs = 0,
                maxArgs = null,
                memberPermissions = [],
                clientPermissions = [],
                cooldown = 0,
                nsfw = false,
                execute
            } = command;

            embed.setTitle(`Info on ${commandName}`)
                .addFields(
                    {
                        name: 'Description',
                        value: description
                    },
                    {
                        name: 'Aliases',
                        value: `\`${prefix}${name}\`\n${aliases.map(x => `\`${prefix}${x}\``).join('\n')}`
                    },
                    {
                        name: 'Use',
                        value: `\`${prefix}${commandName} ${expectedArgs ? expectedArgs : ''}\``
                    })

            //lists examples of command use
            if (examples) {
                embed.addField('Examples', examples.map(x => `\`${prefix}${commandName} ${x}\``).join('\n'))
            }

            embed.addFields(
                {
                    name: 'Member Permissions',
                    value: memberPermissions.join(', ') != '' ? memberPermissions.join(', ') : 'None',
                    inline: true,
                },
                {
                    name: 'Bot Permissions',
                    value: clientPermissions.join(', ') != '' ? clientPermissions.join(', ') : 'None',
                    inline: false,
                },
                {
                    name: 'Server Only?',
                    value: guildOnly.toString(),
                    inline: true,
                },
                {
                    name: 'NSFW?',
                    value: nsfw.toString(),
                    inline: true,
                }
            )

            //cooldown
            if (cooldown > 0) {
                let cooldownTime;
                if (cooldown < 60) cooldownTime = `${cooldown} seconds`
                else cooldownTime = `${cooldown / 60} minutes`

                embed.addField('Cooldown', cooldownTime, true);
            }

            message.channel.send({ embeds: [embed] });
            return
        }

        //Help on everything
        embed.setTitle('Full Description of Commands')
            .setColor('#0099ff')
            .setURL('https://oogieboogiedashboard.herokuapp.com/commands')
            .setDescription('[Help Server](https://discord.com/invite/ph5DVfFmeX) | [Website](https://oogieboogiedashboard.herokuapp.com/)')
            .setThumbnail('http://www.justinmaller.com/img/projects/wallpaper/WP_Encrusted_XI-2560x1440_00000.jpg');

        categoryNames.forEach(category => {
            embed.addField(
                `${category.charAt(0).toUpperCase() + category.slice(1)} commands`,
                `\n\`${prefix}help ${category}\``,
                true,
            )
        })

        message.channel.send({ embeds: [embed] });

    },
};

let makeCommandList = (array) => {
    let ans = '';
    array.forEach(command => {
        ans += `\`${prefix}${command.name} ${command.expectedArgs || ''}\` ${command.description} \n\n`;
    });
    return ans;
}