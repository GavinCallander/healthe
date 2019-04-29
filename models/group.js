const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    Name: String,
    Members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    Threads: [{type: Schema.Types.ObjectId, ref: 'Thread'}]
})

module.exports = mongoose.model('Group', groupSchema);