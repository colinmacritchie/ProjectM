var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Task = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dateCreated: { type: Date, default: Date.now() },
    dateEdited: { type: Date, default: Date.now() },
    dateDue: { type: Date, default: Date.now() },
    dateStart: { type: Date, default: Date.now() },
    dateComplete: { type: Date, default: Date.now() },
    priority: { type: String, trim: true },
    status: { type: String, trim: true },
    position: {type: String, trim: true},
    hoursEstimate: { type: String, trim: true },
    hoursActual: { type: String, trim: true },
    custom: { type: Object },
    active: { type: Boolean, default: true },
    owner: { type: ObjectId, ref: 'User' },
    creator: { type: ObjectId, ref: 'User' },
    project: { type: ObjectId, ref: 'Project' },
    stream: [],
    subscribers: [{ type: ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Task', Task);


Task.pre('update', function () {
    //TODO: add current snapshot to stream 
    this.dateEdited = Date.now();
});