const mongoose = require('mongoose');

const timeoutRoleSchema = mongoose.Schema({
    _id: String,
    timeoutRole: String,
});

module.exports = mongoose.model('Timeout-role', timeoutRoleSchema, 'timeout-role');
