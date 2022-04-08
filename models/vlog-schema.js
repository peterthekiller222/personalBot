const mongoose = require('mongoose');

const vlogSchema = mongoose.Schema({
    _id: String,
    vlogChannelID: String,
});

module.exports = mongoose.model('Vlog', vlogSchema, 'vlog');
