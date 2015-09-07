//node default modules
exports.fs = require('fs');
exports.http = require('http');
exports.https = require('https');
exports.path = require('path');
//npm installed
var sessions = require('express-session');
exports.express = require('express');
exports.sessions = sessions;
exports.forceSSL = require('express-force-ssl');
exports.vhost = require('vhost');
exports.cookieParser = require('cookie-parser');
exports.bodyParser = require('body-parser');
exports.cors = require('cors');
exports.helmet = require('helmet');
exports.MongoStore = require('connect-mongo')(sessions);
exports.compression = require('compression');
exports.morgan = require('morgan');
exports.passport = require('passport');
exports.passportlocal = require('passport-local');
exports.jwt = require('jsonwebtoken');
