var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/spendingsDB');
var schema = mongoose.Schema;
var spendingsSchema = {
    "data": Date,
    "pagou": String,
    "valor": Number,
    "paraQuem": [String],
    "groupID": schema.Types.ObjectId
};
module.exports = mongoose.model('spendings', spendingsSchema);
