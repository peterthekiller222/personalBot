const config = require('@root/config.json');
const prefix = config.prefix;

module.exports = client => {
    client.user.setActivity(`p help`, { type: 'LISTENING' });
    

    console.log('BOT IS ONLINE AND READY');
}