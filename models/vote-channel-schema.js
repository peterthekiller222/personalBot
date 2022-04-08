const mongoose = require('mongoose');

const voteChannelSchema = mongoose.Schema({
    serverID: String,
    voteChannelID: String,
});

module.exports = mongoose.model('Vote-channel', voteChannelSchema, 'vote-channel');
