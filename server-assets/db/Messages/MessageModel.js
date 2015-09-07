var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Message = new Schema({
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    created: { type: Date, required: true, default: new Date() },
    author: { type: ObjectId, ref: 'User' },
    box: { type: ObjectId, ref: 'Box' },
    recipients: [{ type: ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Message', Message);