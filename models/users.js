var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/usersDB');

var usersSchema = {
    "name": "string",
    "email": "string",
    "password": "string"
};
module.exports = mongoose.model('users', usersSchema);
