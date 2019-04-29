const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
    name: String,
    owner: [{type: Schema.Types.ObjectId, ref: 'User'}],
    group: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Messages'}]
})

module.exports = mongoose.model('Thread', threadSchema);