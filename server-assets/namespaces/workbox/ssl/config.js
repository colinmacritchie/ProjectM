//SSL
var fs = require('fs');
exports.ca =fs.readFileSync('./server-assets/namespaces/workbox/ssl/certs/intermediate-cert.pem');
exports.key = fs.readFileSync('./server-assets/namespaces/workbox/ssl/certs/wb-private-key.pem');
exports.cert = fs.readFileSync('./server-assets/namespaces/workbox/ssl/certs/certificate.pem');
