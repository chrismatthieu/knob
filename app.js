/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    request = require('request'),
    config = require('./config');

var app = express();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/main', routes.main);
app.get('/settings', routes.settings);
app.get('/home/:state', routes.home);
app.get('/about/:state', routes.about);
app.get('/members/:state', routes.members);
app.get('/profile/:user', routes.profile);
app.get('/news/:state', routes.feed);
app.get('/events/:state', routes.events);

app.get('/logout', function (req, res) {
    res.clearCookie('state');
    res.redirect('/');
});    


app.listen(process.env.PORT || config.port, function () {
    console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
});