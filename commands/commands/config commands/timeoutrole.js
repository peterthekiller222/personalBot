//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./activity.sqlite');
const Discord = require('discord.js');
const timeoutSchema = require('@models/timeout-role-schema');

module.exports = {
    name: 'muterole',
    examples: ['off', '@role', '{role id}'],
    aliases: ['timeoutrole'],
    description: 'The role given to timeout / mute from server.',
    expectedArgs: '{role id} / off',
    guildOnly: true,
    minArgs: 0,
    maxArgs: 1,
    memberPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_ROLES'],
    execute: async (message, args) => {
        let timeoutRoleCollection = timeoutSchema;
        let { guild } = message;

        if (args.length === 0) {
            let timeout = await timeoutRoleCollection.findOne({
                _id: guild.id
            })
            if (timeout) {
                let timeoutRole = 'none';
                if (timeout.timeoutRole !== '') {
                    timeoutRole = `<@&${timeout.timeoutRole}>`;
                }
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${guild.name}'s timeout role`)
                    .addFields(
                        { name: 'Current timeout role:', value: `${timeoutRole}`, inline: false },
                    )
                return message.channel.send({embeds: [embed]});
            } else {
                return message.reply(`Set a timeout role using \`e timeoutrole {role}\``)
            }
        }

        //checks if role is real
        let roleID = args[0].replace(/<|>|@|&/g, '')
        let role = message.guild.roles.cache.get(roleID)
        if (!role) {
            role = await message.guild.roles.fetch(roleID);
        }
        if (args[0] == 'off' || args[0] == 'remove') {
            roleID = '';
        }
        else if (!role) {
            await message.reply('That is not a role!');
            return;
        }

        //updates messages
        await timeoutRoleCollection.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                _id: message.guild.id,
                timeoutRole: roleID
            },
            {
                upsert: true,
            }
        ).exec()

        if (args[0] == 'off'|| args[0] == 'remove') {
            return message.channel.send(`I have successfully deleted the timeout role`)
        }
        message.channel.send(`I have successfully set the timeout role to ${role.name}`)
    },
};