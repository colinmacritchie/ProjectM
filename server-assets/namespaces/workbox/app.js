var wb = require('./config/namespace'),
    modules = require('../../modules'),
    config = require('./config'),
    app = wb.routehandler.main,
    members = wb.routehandler.members,
    api = wb.routehandler.api,
    controllers = wb.dbConnect.db.controllers,
    models = wb.dbConnect.db.models,
    jwt = modules.jwt,
    passport = modules.passport,
    auth = require('./auth')(passport),
    data = require('./data/demo');

//App Initialization
app.use(passport.initialize());
app.use(passport.session());

members.use(modules.express.static(__dirname + '../../../public/workbox/members'));

app.use('/members', members);

/* Handle Registration POST */
app.post('/api/users', function(req, res, next) {
    passport.authenticate('signup', function(err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);
        if (!user) return res.json(404, { message: 'Something went wrong, please try again.' });

        var token = jwt.sign({ _id: user._id }, config.secret.token, { expiresInMinutes: 60 * 5 });
        res.json({ token: token });
    })(req, res, next);
});

app.use('/api', api);

// login
app.post('/auth/local', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);
        if (!user) return res.json(404, { message: 'Something went wrong, please try again.' });

        var token = jwt.sign({ _id: user._id }, config.secret.token, { expiresInMinutes: 60 * 5 });
        res.json({ token: token });
    })(req, res, next);
});

//wait to setup 404 on unknown routes
app.get('*', function (req, res) {
    res.status(404).sendFile('404.html', { root: modules.path.join(__dirname, '../../../public') });
});
//error middleware
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(404).sendFile('404.html', { root: modules.path.join(__dirname, '../../../public') });
});

module.exports = app;
