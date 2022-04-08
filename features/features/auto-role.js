const autoRoleSchema = require('@models/autorole-schema');

module.exports = async (client) => {
    //message logging
    client.on('guildMemberAdd', async (member) => {
        let autoRoleCollection = autoRoleSchema;

        let autoRole = await autoRoleCollection.findOne({
            _id: member.guild.id
        }, (err, object) => { }).catch(() => { })

        if (autoRole && autoRole.autoRole != '') {
            member.roles.add([autoRole.autoRole]).catch(() => { })
        }
    })
}