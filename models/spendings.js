var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/spendingsDB');

var spendingsSchema = {
    "data": "date",
    "pagou": "string",
    "valor": "number",
    "paraQuem": "string",
    "groupID": "objectId"
};
module.exports = mongoose.model('spendings', spendingsSchema);
