const { boolean } = require('mathjs');
const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const muteSchema = mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    reason: String,
    staffId: reqString,
    staffTag: reqString,
    expires: {
        type: Date,
        required: true
    },
    current: {
        type: boolean,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Timeout', muteSchema, 'timeout ');
