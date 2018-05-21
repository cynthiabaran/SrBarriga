var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/usersDB');

var usersSchema = {
    "name": String,
    "email": String,
    "password": String
};
module.exports = mongoose.model('users', usersSchema);
