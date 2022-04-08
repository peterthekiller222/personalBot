const timeoutRoleSchema = require('@models/timeout-role-schema');
const defaultRoleSchema = require('@models/default-role-schema');
const timeoutSchema = require('@models/timeout-schema');

module.exports = async (client) => {
    let timeoutCollection = timeoutSchema;
    let timeoutRoleCollection = timeoutRoleSchema;
    let defaultRoleCollection = defaultRoleSchema;
    const checkMutes = async () => {
        const now = new Date()

        const conditional = {
            expires: {
                $lt: now
            },
            current: true
        }

        const results = await timeoutCollection.find(conditional);

        if (results && results.length) {
            for (const result of results) {
                const { guildId, userId } = result;


                const guild = client.guilds.cache.get(guildId);
                if (!guild) continue
                const member = (await guild.members.fetch()).get(userId)

                let untimeoutRole = await defaultRoleCollection.findOne({
                    _id: guild.id
                })
                if (!untimeoutRole || untimeoutRole.defaultRole === '') continue
                const defaultRole = untimeoutRole.defaultRole;
                member.roles.set([defaultRole]).catch(() => { })
            }
            await timeoutCollection.deleteMany(conditional)
        }

        setTimeout(checkMutes, 1000 * 60);
    }
    checkMutes()

    client.on('guildMemberAdd', async member => {
        timeoutRoleCollection = timeoutRoleSchema;
        const { guild, id } = member

        let timeoutRole = await timeoutRoleCollection.findOne({
            _id: guild.id
        })

        if (!timeoutRole || timeoutRole.timeoutRole === '') return;

        const currentTimeout = await timeoutSchema.findOne({
            userId: id,
            guildId: guild.id,
            current: true
        })

        if (currentTimeout) {
            //remutes them
            member
                .roles.set([timeoutRole.timeoutRole]).catch(() => { })
        }

    })
}