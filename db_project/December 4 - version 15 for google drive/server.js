// import modules
var express = require('express');                         // web framework
var formidable = require('formidable');                  // handles file uploads
var handlebars = require('express-handlebars').create({ defaultLayout:'main'}); // templating engine
var bodyparser = require('body-parser').urlencoded({extended : true});
var morgan = require('morgan');
var credentials = require('./credentials');

// import express module and create instance of module
var server = express();

// allows output of requests to server to the console log
server.use(morgan('combined'));

// instructs express to use the view engine created above (in import modules section)
// as the default engine to render page views
server.engine('handlebars', handlebars.engine);
server.set('view engine', 'handlebars');

// declares static middleware for retrieving static content (images, css, js, etc)
server.use(express.static(__dirname + '/public'));

// links body-parser module to express server to enable access to req.body used to
// retrieve data from POST request bodies
server.use(bodyparser);

// enables use of cookie-parser by the server
server.use(require('cookie-parser')(credentials.cookieSecret));

// enables use of sessions to store user information
server.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

// passes express server instance to the routes module to handle routing
var routes = require('./routes')(server);

// instructs the server to listen to the specified port number
var serverPort = 8000;
server.set('port', serverPort);
server.listen(server.get('port'), function () {
   console.log('Server online and listening on port: ' + server.get('port'));
   console.log('To terminate process, press \'Control + C\'');
});
