var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Widget = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['Box', 'Project', 'Task'] }
});

module.exports = mongoose.model('Widget', Widget);