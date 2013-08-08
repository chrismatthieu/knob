var request = require('request');
var sha1 = require('sha1');
var config = require('./../config');

function makeStamp(d) { // Date d
    var y = d.getUTCFullYear(),
        M = d.getUTCMonth() + 1,
        D = d.getUTCDate(),
        h = d.getUTCHours(),
        m = d.getUTCMinutes(),
        s = d.getUTCSeconds(),
        pad = function (x) {
            x = x+'';
            if (x.length === 1) {
                return '0' + x;
            }
            return x;
        };
        return y + pad(M) + pad(D) + pad(h) + pad(m) + pad(s);
}

exports.index = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.render('index', { title: 'Towers' })
  } else {
    res.redirect('/main');
  }
};

exports.main = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {

    request(
      { method: 'GET'
      , uri: 'https://api.becpsn.com/svc1/v2/tracking/towers/projects/'
      , 'content-type': 'application/json'
      , headers: {"X-myPSN-AppKey": "43a6aba88a422d696c1d9f50e8e4831f", "Authorization": req.cookies.bechtel_token}
      }
    , function (error, response, body) {
        if(response.statusCode == 200){
          console.log(body);
          jdata = JSON.parse(body);
          res.render('main', { projects: jdata.items })
        } else if(response.statusCode == 403) {
          res.clearCookie('bechtel_token');
          res.redirect('/');
        } else {
          console.log('error: '+ response.statusCode)
          console.log(body)
          res.render('main', {})
        }
      }
    )
  }
};

exports.markets = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {

    request(
      { method: 'GET'
      , uri: 'https://api.becpsn.com/svc1/v2/tracking/towers/markets/'
      , 'content-type': 'application/json'
      , headers: {"X-myPSN-AppKey": "43a6aba88a422d696c1d9f50e8e4831f", "Authorization": req.cookies.bechtel_token}
      }
    , function (error, response, body) {
        if(response.statusCode == 200){
          console.log(body);
          jdata = JSON.parse(body);
          res.render('markets', { markets: jdata.items })
        } else if(response.statusCode == 403) {
          res.clearCookie('bechtel_token');
          res.redirect('/');
        } else {
          console.log('error: '+ response.statusCode)
          console.log(body)
          res.render('markets', {})
        }
      }
    )

  }
};


exports.sites = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {

    // request(
    //   { method: 'GET'
    //   , uri: 'https://api.becpsn.com/svc1/v2/tracking/towers/markets/#{req.params.market}/Sites'
    //   , 'content-type': 'application/json'
    //   , headers: {"X-myPSN-AppKey": "43a6aba88a422d696c1d9f50e8e4831f", "Authorization": req.cookies.bechtel_token}
    //   }
    // , function (error, response, body) {
    //     if(response.statusCode == 200){
    //       console.log(body);
    //       jdata = JSON.parse(body);
    //       res.render('sites', { sites: jdata.items, market: req.params.market})
    //     } else {
    //       console.log('error: '+ response.statusCode)
    //       console.log(body)
    //       res.render('sites', {})
    //     }
    //   }
    // )

    res.render('sites', { market: req.params.market })
  }
};

exports.settings = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {
    res.render('settings', { })
  }
};


exports.getMarkets = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {

    request(
      { method: 'GET'
      , uri: 'https://api.becpsn.com/svc1/v2/tracking/towers/markets/'
      , 'content-type': 'application/json'
      , headers: {"X-myPSN-AppKey": "43a6aba88a422d696c1d9f50e8e4831f", "Authorization": req.cookies.bechtel_token}
      }
    , function (error, response, body) {
        if(response.statusCode == 200){
          console.log(body);
          res.send(body);
        } else if(response.statusCode == 403) {
          res.clearCookie('bechtel_token');
          res.redirect('/');
        } else {
          console.log('error: '+ response.statusCode)
          console.log(body)
          res.send({});
        }
      }
    )

    // res.render('main', { markers: {} })
  }
};

exports.getSites = function(req, res){
  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {

    request(
      { method: 'GET'
      , uri: 'https://api.becpsn.com/svc1/v2/tracking/towers/markets/' + req.params.market + '/Sites'
      , 'content-type': 'application/json'
      , headers: {"X-myPSN-AppKey": "43a6aba88a422d696c1d9f50e8e4831f", "Authorization": req.cookies.bechtel_token}
      }
    , function (error, response, body) {
        if(response.statusCode == 200){
          console.log(body);
          res.send(body);
        } else if(response.statusCode == 403) {
          res.clearCookie('bechtel_token');
          res.redirect('/');
        } else {
          console.log('error: '+ response.statusCode)
          console.log(body)
          res.send({});
        }
      }
    )

    // res.render('main', { markers: {} })
  }
};

exports.getFleet = function(req, res){
  // Using FleetMatics API

  if (req.cookies.bechtel_token == undefined) {
    res.redirect('/');
  } else {

    // var fleetguid = "672F6A41-F9E7-E211-9F99-AC162DBDB9D7";
    var fleetguid = config.fleetguid;
    var fleettoken = config.fleettoken;
    var now = new Date();
    var timestamp = makeStamp(now);
    var rawsig = fleetguid + timestamp
    var hash = sha1(rawsig).toUpperCase();

    console.log('guid: ' + fleetguid);
    console.log('token: ' + fleettoken);
    console.log('timestamp: ' + timestamp);
    console.log('sig: ' + hash);

    var fleeturi = "http://www.fleetmatics-usa.com/FMAPI/apitrackingservice.svc/getvehpos"
    // var fleeturi = "http://www.fleetmatics-usa.com/FMAPI/apitrackingservice.svc"
    var qs ="t=" + fleettoken + "&s=" + hash + "&ts=" + timestamp;
    console.log('uri: ' + fleeturi);
    console.log('qs: ' + qs);

    console.log(fleeturi + '?t=' + fleettoken + '&s=' + hash + '&ts=' + timestamp);

    request(
      { method: 'GET'
      , uri: fleeturi 
      , qs: qs
      , 'Content-Type': 'application/xml'
      }
    , function (error, response, body) {
        // if(response.statusCode == 200){
        //   console.log(body);
        //   res.send(body);
        // } else if(response.statusCode == 403) {
        //   res.clearCookie('bechtel_token');
        //   res.redirect('/');
        // } else {
        //   console.log('error: '+ response.statusCode)
        //   console.log(body)
        //   res.send({});
        // }

          console.log('error: '+ response.statusCode);
          console.log(body);

      }
    )

    // res.render('main', { markers: {} })
  }
};


