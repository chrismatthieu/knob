/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    request = require('request');

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
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
        console.log(error);
        console.log(response);
        console.log(body);

        if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
        }
    })

    // body = {"com.pingidentity.plugin.instanceid":"PSN2AgentlessDemo","subject":"clmatthi@bechtel.com","BechtelEmployeeNumber":"clmatthi@bechtel.com","BechtelEmailAddress":"clmatthi@bechtel.com","instanceId":"PSN2AgentlessDemo","EmploymentStatus":"Employee","WorkPhoneNumber":"+1 415 7688484","LastName":"Matthieu","sessionid":"So9oDUnHfGVStaWaF0rRY9bOQRO","Title":"Systems & Technology Architect","authnCtx":"urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified","partnerEntityID":"PSN2-SAML2-Entity","BechtelUserName":"clmatthi","FirstName":" Christopher","IsBechtelEmployee":"1","BechtelDomain":"IAMERS","authnInst":"2012-12-03 11:05:31-0500","EMailAddress":"clmatthi@bechtel.com","OAuthToken":"PB05ZF1tKKSA6u2hGMnip34bCw0j"}

    // @jdata = JSON.parse(body)
    // EMail = @jdata['EMailAddress']

    res.send('sso successful');

    // redirect "/"

});

app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});