//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./avity.sqlite');
const Discord = require('discord.js');
const autoRoleSchema = require('@models/autorole-schema');

module.exports = {
    name: 'autorole',
    examples: ['off', '@role', '{role id}'],
    description: 'The role given to new members.',
    expectedArgs: '{role id} / off',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 1,
    memberPermissions: ['MANAGE_ROLES'],
    clientPermissions: ['MANAGE_ROLES'],
    execute: async (message, args) => {
        let autoRoleCollection = autoRoleSchema;
        let { guild } = message;

        if (args.length === 0) {
            let autoRoleObject = await autoRoleCollection.findOne({
                _id: message.guild.id
            })
            if (autoRoleObject) {
                let autoRole = 'none';
                if (autoRoleObject.autoRole !== '') {
                    autoRole = `<@&${autoRoleObject.autoRole}>`;
                }
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${guild.name}'s auto new role`)
                    .addFields(
                        { name: 'Current Auto role:', value: `${autoRole}`, inline: false },
                    )
                return message.channel.send({embeds: [embed]});
            } else {
                return message.reply(`Set an auto role using \`e autorole {role}\``)
            }
        }

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

        autoRoleCollection.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                _id: message.guild.id,
                autoRole: roleID,
            },
            {
                upsert: true,
            }
        ).exec()

        if (args[0] == 'off' || args[0] == 'remove') {
            return message.channel.send(`I have successfully deleted the auto role`)
        }
        message.channel.send(`I have successfully set the auto role to ${role.name}`)
    },
};