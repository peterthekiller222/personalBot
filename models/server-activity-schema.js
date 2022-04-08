const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: String,
    userTag: String,
    lastUpdate: String,
    messages: Number,
    voice: Number,
    isVoice: Boolean,
    voiceJoinedStamp: String
});

const activityDB = mongoose.connection.useDb('Activity');

module.exports = guildID => {
    return activityDB.model('Activity', guildSchema, guildID);
}