/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    request = require('request');

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


// LOCALHOST
var port = 60883;
var appKey = "";
var pingUname = "";
var pingPwd = "";
var pingInanceId = "";
var domain = "http:localhost:" + port;

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

app.get('/callback', function (req, res) {

    var ref = req.query["REF"];
    console.log('REF: ' + ref);
    var url = encodeURI("https://sso.mypsn.com/ext/ref/pickup");
    console.log("URL: " + url);

    var opt = {
        qs: {
          'REF': ref
        },
        headers: {
            'ping.uname': pingUname,
            'ping.pwd': pingPwd,
            'ping.instanceId': pingInanceId
        }
    };

    request(url, opt, function (error, response, body) {
        // console.log(error);
        // console.log(response);
        // console.log(body);

        if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
            var jdata = JSON.parse(body);
            var token = jdata['OAuthToken'];

            res.cookie('bechtel_token', token, {
              maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
              httpOnly: false
            });            

            res.send('token: ' + token);

        } else {
            res.send('OAuth failed.');
        }

    })

});

app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});