var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Note = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateEdited: { type: Date, required: true, default: Date.now() },
    position: {type: String, trim: true},
    active: { type: Boolean, default: true },
    custom: { type: Object },
    owner: { type: ObjectId, ref: 'User' },
    creator: { type: ObjectId, ref: 'User' },
    projectId: { type: ObjectId, ref: 'Project'},
    taskId: { type: ObjectId, ref: 'task'}
});

module.exports = mongoose.model('Note', Note);


Note.pre('save', function (next) {
    //TODO: add current snapshot to stream 
    this.dateEdited = Date.now();
    next();
});