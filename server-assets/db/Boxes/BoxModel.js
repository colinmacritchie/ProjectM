var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Box = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateEdited: { type: Date, required: true, default: Date.now() },
    position: {type: String, trim: true},
    active: { type: Boolean, default: true },
    custom: { type: Object },
    owner: { type: ObjectId, ref: 'User' },
    creator: { type: ObjectId, ref: 'User' },
    stream: [],
    subscribers: [{ type: ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Box', Box);


Box.pre('save', function (next) {
    //TODO: add current snapshot to stream 
    this.dateEdited = Date.now();
    next();
});