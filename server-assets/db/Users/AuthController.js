var Users = require('./UserModel'),
    validator = require('validator');

function _find(email, cb) {
    Users.findOne({
        email: email
    }).select('-password').exec(function (err, user) {
        if (err) {
            return cb(err);
        }
        return cb(null, user);
    });
}

function authenticate(req, res){
    if(!req.session.uid){
        return res.send({error: 'Unable to validate your user please login to continue'});
    }
    Users.findOne({_id: req.session.uid}).select('-password').exec(function(err, user){
        if(err){
            console.log(err);
            return res.send({err: err});
        }
        if(user){
            return res.send(user);
        }
        return res.send({error: 'Your user was not found please login to continue'})
    })
}

function login(req, done) {
    Users.findOne({
        email: req.body.username
    }, function (err, user) {
        if (err) {
            console.log('Login Error: While looking up User. ' + JSON.stringify(err));
            return done(err);
        }
        
        if (!user) {
            console.log('Login Warning: User Not Found with username ' + JSON.stringify(user));
            return done(null, false, { message: 'User Not found.' });
        }
        
        user.validatePassword(req.body.password, function (err, valid) {
            if (err) {
                console.log('Login Error: unable to validate password. ' + JSON.stringify(err));
                return done(err);
            } else if (valid) {
                console.log('Login Success: password validated');
                req.session.uid = user._id;
                return done(null, user);
            } else {
                console.log('Login Warning: password not valid');
                return done(null, false, { message: 'Invalid Password' });
            }
        });
    });
}

function register(req, done) {
    var newUser = new Users({
        companyName: req.body.companyname,
        fullName: req.body.fullname,
        role: 'user',
        email: req.body.username,
        password: req.body.password
    });
    
    _find(req.body.username, function (err, user) {
        if (err) {
            console.log('Register Error: While looking up User. ' + JSON.stringify(err));
            return done(err);
        }
        
        if (user) {
            console.log('Register warning: User already exists');
            return done(null, false, { message: 'User already exists' });
        } else {
            newUser.save(function (err) {
                if (err) {
                    console.log('Register Error: saving User. ' + JSON.stringify(err));
                    throw err;
                }
                newUser.save(function (err) {
                    if (err) {
                        console.log('Register Error: saving User. ' + JSON.stringify(err));
                        throw err;
                    }
                    console.log('Register Success: User saved ' + JSON.stringify(newUser));
                    req.session.uid = newUser._id;
                    return done(null, newUser);
                });
            });
        }
    });
}

function updateUser(req, res) {
    if (!req.session.uid) {
        return res.send({ message: 'You must login before making changes to your account' });
    }
    var newUser = req.body.user;
    Users.findOneAndUpdate({
        _id: req.session.uid
    }, newUser, function (err, user) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'User information updated', user: newUser });
    });
}

function logout(req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({ message: 'logged out' });
    });
}

function getUsers (req, res){
    Users.find().select('-password').exec(function(err, users){
        if(err){
            return res.send(err);
        }
        return res.send(users);
    });
}

function getUser (req, res){
    Users.findOne({_id: req.params.id}).select('-password').exec(function(err, user){
        if(err){
            return res.send(err);
        }
        return res.send(user);
    });
}

module.exports = {
    login: login,
    register: register,
    update: updateUser,
    logout: logout,
    authenticate: authenticate,
    getUsers: getUsers,
    getUser: getUser
};
