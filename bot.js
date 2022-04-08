require('module-alias/register');

const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({ intents: new Discord.Intents(32767) });
client.commands = new Discord.Collection();
client.snipes = new Discord.Collection();
client.editSnipes = new Discord.Collection();
client.mathScopes = new Discord.Collection();
client.mongoose = require('@utils/mongoose');
//.replace(/[<@!>]/g, '');

const loadEvents = require('@root/events/load-events');
const loadCommands = require('@root/commands/load-commands');
const loadFeatures = require('@root/features/load-features');

client.login(process.env.BOTTOKEN);

loadEvents(client);
console.log('Loaded events')
loadCommands(client);
console.log('Loaded commands')
loadFeatures(client);
console.log('Loaded features')
client.mongoose.init();

module.exports = client;