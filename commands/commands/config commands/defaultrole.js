//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./activity.sqlite');
const Discord = require('discord.js');
const defaultRoleSchema = require('@models/default-role-schema');

module.exports = {
    name: 'defaultrole',
    examples: ['off', '@role', '{role id}'],
    description: 'The role to untimeout/unmute.',
    expectedArgs: '{role id} / off',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 1,
    memberPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_ROLES'],
    execute: async (message, args) => {
        let defaultRoleCollection = defaultRoleSchema;
        let { guild } = message;

        if (args.length === 0) {
            let timeout = await defaultRoleCollection.findOne({
                _id: guild.id
            })
            if (timeout) {
                let defaultRole = 'none';
                if (timeout.defaultRole !== '') {
                    defaultRole = `<@&${timeout.defaultRole}>`;
                }
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${guild.name}'s default role`)
                    .addFields(
                        { name: 'Current default role:', value: `${defaultRole}`, inline: false },
                    )
                return message.channel.send({embeds: [embed]});
            } else {
                return message.reply(`Set a default role using \`e defaultrole {role}\``)
            }
        }

        //checks for roles
        let roleID = args[0].replace(/<|>|@|&/g, '')
        let role = message.guild.roles.cache.get(roleID)
        if (!role) {
            role = await message.guild.roles.fetch(roleID);
        }

        if (args[0] == 'off' || args[0] == 'remove') {
            roleID = '';
        }
        else if (!role) {
            return message.reply('That is not a role!');
        }

        await defaultRoleCollection.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                _id: message.guild.id,
                defaultRole: roleID
            },
            {
                upsert: true,
            }
        ).exec()

        if (args[0] == 'off' || args[0] == 'remove') {
            return message.channel.send(`I have successfully deleted the default role`)
        }
        message.channel.send(`I have successfully set the default role to ${role.name}`)
    },
};