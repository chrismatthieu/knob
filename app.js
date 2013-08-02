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
var appKey = "43a6aba88a422d696c1d9f50e8e4831f";
var pingUname = "PSN2AgentlessDemoUser";
var pingPwd = "jlAclUVoA6oAfrlUbOEMo-Troe*";
var pingInanceId = "PSN2AgentlessDemo";
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
app.get('/main', routes.main);
app.get('/markets/:project', routes.markets);
app.get('/sites/:market', routes.sites);
app.get('/getMarkets', routes.getMarkets);
app.get('/getSites/:market', routes.getSites);

app.get('/logout', function (req, res) {
    res.clearCookie('bechtel_token');
    res.redirect('/');
});    

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

            // res.send('token: ' + token);
            // res.render('main', { token: token })
            res.redirect('/main');

        } else {
            // res.send('OAuth failed.');
            res.render('error', { error: JSON.stringify(error) })
        }

    })

});

app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});