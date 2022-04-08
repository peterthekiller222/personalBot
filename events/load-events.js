fs = require('fs');

module.exports = (client) => {
    fs.readdir('./events/events/', (err, files) => {
        if (err) return console.error;
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const evt = require(`./events/${file}`);
            
            let evtName = file.split('.')[0];
            client.on(evtName, evt.bind(null, client));
        });
    });
}