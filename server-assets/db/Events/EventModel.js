var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Event = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateEdited: { type: Date, default: Date.now() },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: Date.now() },
    position: {type: String, trim: true},
    priority: { type: String, trim: true },
    status: { type: String, trim: true },
    custom: { type: Object},
    active: { type: Boolean, default: true },
    owner: { type: ObjectId, ref: 'User' },
    creator: { type: ObjectId, ref: 'User' },
    boxId: { type: ObjectId, ref: 'Box' },
    tasks: [{ type: ObjectId, ref: 'Task' }],
    stream: [],
    subscribers: [{ type: ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', Event);


Event.pre('update', function () {
    //TODO: add current snapshot to stream 
    this.dateEdited = Date.now();
});