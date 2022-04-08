const mongoose = require('mongoose');

const snipeSchema = mongoose.Schema({
    _id: String,
    snipeEnabled: Boolean,
});

module.exports = mongoose.model('Snipes', snipeSchema, 'snipes');
