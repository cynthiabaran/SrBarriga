var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/spendingsDB');
var schema = mongoose.Schema;
var spendingsSchema = {
    "data": String,
    "pagou": String,
    "valor": Number,
    "paraQuem": [String],
    "groupID": String
};
module.exports = mongoose.model('spendings', spendingsSchema);
