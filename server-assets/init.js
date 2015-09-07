var app = require('express')(),
    theme = require('express')(),
    WorkBox = require('./namespaces/workbox/app'),
    modules = require('./modules'),
    nodemailer = require('nodemailer'),
    port = 8080,
    securePort = 8443;

var smtpTransport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
        user: 'useworkbox@gmail.com',
        pass: "P`x7kYxyu(K'2f#+"
    }
});

var server = modules.http.createServer(app),
    secureServer = modules.https.createServer(require('./namespaces/workbox/ssl/config'), app);

//Cors Setup
var corsOptions = {
    origin: 'https://useworkbox.com'
};
app.options(modules.cors(corsOptions));

var accessLogStream = modules.fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

// setup the logger
app.use(modules.morgan('combined', { stream: accessLogStream }));

//compress files to optimize load times
app.use(modules.compression());

theme.use(modules.express.static(__dirname + '../../public/theme'));
app.use(modules.express.static(__dirname + '../../public/workbox'));

//Use SSL on all routes
//app.use(modules.forceSSL);

//helmet provides basic security
app.use(modules.helmet());

//Handles request parsing
app.use(modules.cookieParser());
app.use(modules.bodyParser.json());
app.use(modules.bodyParser.urlencoded({ extended: true }));

//register routes
app.use('/theme', theme);
app.get('/send', function(req, res) {
    var mailOptions = {
        to: 'support@firstconnectsolutions.com',
        subject: req.query.subject,
        text: req.query.text
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if(error) {
            console.log(error);
            res.end('error');
        } else {
            console.log('Message sent: ' + response.message);
            res.end('sent');
        }
    });
});
app.use('/', WorkBox);

// Starts the server listening on the specified port
server.listen(port, function () {
    console.log('Listening at localhost on port: ', port);
});
secureServer.listen(securePort, function () {
    console.log('Listening at localhost on port: ', securePort);
});
