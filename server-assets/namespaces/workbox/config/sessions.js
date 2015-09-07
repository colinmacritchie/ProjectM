var wb = require('./namespace'),
  modules = require('../../../modules'),
  app = wb.routehandler.main;

var store = new modules.MongoStore({
  url: 'mongodb://localhost/WorkBoxSessionStore'
});

var sessionStore = {
      secret: 'ZRXKONuC4OlDWHJN',
      resave: false,
      saveUninitialized: true,
      name: 'WorkBox',
      store: store
    };

exports.session = (function(){
  app.use(modules.sessions(sessionStore));
}());
