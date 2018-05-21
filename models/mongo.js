var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/SrBarrigaDB');
var Schema = mongoose.Schema;

var spendingsSchema = new Schema ({
    "data": "date",
    "pagou": "string",
    "valor": "double",
    "paraQuem": "string",
    "groupID": "objectId"
});

var groupsSchema = new Schema ({
    "id": "objectId",
    "nome": "string",
    "admin": "string",
    "membros": "string",
    "despesas": "objectId",
});

var usersSchema = new Schema ({
    "name": "string",
    "email": "string",
    "password": "string"
});

module.exports = mongoose.model('users', usersSchema);
module.exports = mongoose.model('spendings', spendingsSchema);
module.exports = mongoose.model('groups', groupsSchema);
