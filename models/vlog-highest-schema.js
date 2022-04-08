const mongoose = require('mongoose');

const highestVoiceSchema = mongoose.Schema({
    _id: String,
    highestMemberID: String,
    time: String,
});
module.exports = mongoose.model('Vlog-highest', highestVoiceSchema, 'vlog-highest');
