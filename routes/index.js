var request = require('request');

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

    console.log('https://api.becpsn.com/svc1/v2/tracking/towers/markets/' + req.params.market + '/Sites');

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
