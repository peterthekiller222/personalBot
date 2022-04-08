const config = require('@root/config.json');
const prefix = config.prefix;

module.exports = client => {
    client.user.setActivity(`p help`, { type: 'LISTENING' });
    client.guilds.cache.get('731274366519869580').channels.cache.get('875250361261256744').send('BOT IS ONLINE AND READY');

    console.log('BOT IS ONLINE AND READY');
}