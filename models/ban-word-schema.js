const mongoose = require('mongoose');

const banWordSchema = mongoose.Schema({
    _id: String,
    banWords: [String],
});

module.exports = mongoose.model('Banwords', banWordSchema, 'banwords');
