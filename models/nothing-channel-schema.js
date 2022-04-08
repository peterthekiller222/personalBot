const mongoose = require('mongoose');

const voteChannelSchema = mongoose.Schema({
    serverID: String,
    nothingChannelID: String,
});

module.exports = mongoose.model('Nothing-channel', voteChannelSchema, 'nothing-channel');
