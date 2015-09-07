var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Boxes = require('../Boxes/BoxModel'),
    bcrypt = require('bcryptjs'),
    SALT_FACTOR = 10;

var Company = new Schema({
    phoneNumber: { type: String, trim: true },
    companyName: { type: String, required: false, trim: true },
    password: { type: String, required: true, trim: true },
    created: { type: Date, required: false, default: new Date() },
    owner: {type: ObjectId, ref: 'User'},
    creator: {type: ObjectId, ref: 'User'},
    members: [{
        memberId: {type: ObjectId, ref: 'User'},
        role: {type: String, enum: ['Admin', 'Moderator', 'Member']}
    }]
});

Company.pre('save', function (next) {
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

Company.methods.validatePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        return cb(null, isMatch);
    });
};

module.exports = mongoose.model('Company', Company);
