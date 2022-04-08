module.exports = {
    name: 'ping',
    description: 'Gives the bot\'s ping.',
    
    execute(message, args) {

        message.channel.send(`Calculating ping...`).then((resultMessage)=>{
            const ping = resultMessage.createdTimestamp - message.createdTimestamp;

            resultMessage.edit(`\`Bot latency:\` ${ping}ms \n\`API latency:\` ${message.client.ws.ping}ms`);
        });
    },
}; 