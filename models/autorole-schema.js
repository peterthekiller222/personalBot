const mongoose = require('mongoose');

const autoRoleSchema = mongoose.Schema({
    _id: String,
    autoRole: String,
});

module.exports = mongoose.model('Auto-role', autoRoleSchema, 'auto-role');
