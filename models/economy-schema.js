const { number } = require('mathjs');
const mongoose = require('mongoose');

const economySchema = mongoose.Schema({
    _id: String,
    bank: Number,
    money: Number,
});

module.exports = mongoose.model('Economy', economySchema, 'economy');
