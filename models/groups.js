var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/groupsDB');
var schema = mongoose.Schema;
var groupsSchema = {
    "id": schema.Types.ObjectId,
    "nome": String,
    "admin": String,
    "membros": [String]
};
module.exports = mongoose.model('groups', groupsSchema);
