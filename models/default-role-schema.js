const mongoose = require('mongoose');

const defaultRoleSchema = mongoose.Schema({
    _id: String,
    defaultRole: String,
});

module.exports = mongoose.model('Default-role', defaultRoleSchema, 'default-role');
