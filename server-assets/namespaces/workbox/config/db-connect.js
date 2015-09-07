var mongoose = require('mongoose'),
    connection = mongoose.connection;

mongoose.connect('mongodb://localhost/WorkBox', {mongos: true}, function() {
    console.log('successfully connected to MongoDb WorkBox');
});
exports.db = require('../../../db/main');