var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    username: {
        type: String,
        unique: true
    },
    balance: String,
    provider: String,
    salt: String,
    venmo: {},
    access_token: String,
    refresh_token: String,
    uid: String,
    profilePic: String,
    dateJoined: String 
});

module.exports = mongoose.model('User', userSchema);
