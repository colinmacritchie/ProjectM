'use strict';

var db = require('../config/namespace').dbConnect.db;
var User = db.models.users;

/**
/*	Seed db with admin user
/*/
User.find({email: 'admin@workbox.com'}, function(err, users) {
	if (err) {
		console.log(err);
	}

	if (users && users.length < 1) {
		User.create({
		    companyName: 'workbox',
		    fullName: 'administrator',
		    role: 'admin',
		    email: 'admin@workbox.com',
		    password: 'admin'
		}, function() {
		  console.log('Add admin user');
		});
	}
});
