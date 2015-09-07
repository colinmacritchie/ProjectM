var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Boxes = require('../Boxes/BoxModel'),
    bcrypt = require('bcryptjs'),
    SALT_FACTOR = 10;

var User = new Schema({
    firstName:{ type: String, trim: true },
    lastName: { type: String, trim: true }, 
    phoneNumber: { type: String, trim: true },
    companyName: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: {
        type: String,
        default: 'user'
    },
    password: { type: String, required: true, trim: true },
    joined: { type: Date, required: false, default: new Date() },
    companies: [{type: ObjectId, ref: 'Company'}],
    messages: [{ type: ObjectId, ref: 'Message' }],
    boxes: [{ type: ObjectId, ref: 'Box' }],
    notes: [{ type: ObjectId, ref: 'Note' }],
    events: [{ type: ObjectId, ref: 'Event' }],
    projects: [{ type: ObjectId, ref: 'Project' }],
    tasks: [{ type: ObjectId, ref: 'Task' }],
    widgets: [{
            widget: { type: ObjectId, ref: 'Widget' },
            active: { type: Boolean, default: true }
        }]
});

User.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        } else {
            bcrypt.hash(user.password, salt, function (err, hash) {
                user.password = hash;
                next();
            });
        }
    });
});

User.methods.validatePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        return cb(null, isMatch);
    });
};

User.methods.getTimeStamp = function (message) {
    var user = this;
    var timestamp = {
        message: message || '',
        user: user,
        date: Date.now()
    };
    return timestamp;
};

//Cascade Delete Boxes
User.pre('remove', function (next) {
    Boxes.remove({ owner: this._id }).exec();
    next();
});

module.exports = mongoose.model('User', User);
