var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/groupsDB');

var groupsSchema = {
    "id": "objectId",
    "nome": "string",
    "admin": "string",
    "membros": "string",
    "despesas": "objectId",
};
module.exports = mongoose.model('groups', groupsSchema);
