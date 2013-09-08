var request = require('request');
// var parser = require('xml2json');
var config = require('./../config');
var databaseUrl = config.databaseUrl; //Example using MongoHQ: [USER]:[PASSWORD]@staff.mongohq.com:[PORT]/[APP]
var mongojs = require('mongojs');
var db = mongojs(databaseUrl, ['users', 'events']);


exports.index = function(req, res){
  if (req.cookies.state == undefined) {
    res.render('index', { title: 'Knights on Bikes' });
  } else {
    res.redirect('/home/' + req.cookies.state);
  }
};

exports.home = function(req, res){

  res.cookie('state', req.params.state, {
    maxAge: 1000 * 60 * 60 * 60 * 24 * 365,
    httpOnly: false
  }); 

  res.render('home', { state: req.params.state, contact: 'chris@matthieu.us' });

};

exports.about = function(req, res){
  res.render('about', { state: req.params.state });
};

exports.members = function(req, res){

  db.users.find({}, function(err, userdata) {
    // console.log(userdata);
    if(err || userdata.length < 1) {
      res.render('members', {state: req.params.state });
    } else {
      res.render('members', { users: userdata, state: req.params.state });
    }

  });


  // res.render('members', { state: req.params.state });
};

exports.profile = function(req, res){

  db.users.find({
    userid: parseInt(req.params.user)
  }, function(err, userdata) {
    if(err || userdata.length < 1) {
      res.render('profile', { });
    } else {
      res.render('profile', { user: userdata[0] });
    }

  });

};

exports.events = function(req, res){

  db.events.find({}, function(err, eventdata) {
    // console.log(userdata);
    if(err || eventdata.length < 1) {
      res.render('events', {state: req.params.state });
    } else {
      res.render('events', { events: eventdata, state: req.params.state });
    }

  });


  // res.render('members', { state: req.params.state });
};


exports.main = function(req, res){
  res.render('main', { });
};

exports.settings = function(req, res){
  res.render('settings', { state: req.params.state });
};

exports.feed = function(req, res){
  var body, config, http, simplexml;

  http = require("http");
  simplexml = require("xml-simple");

  // http://fbrss.com/f/cd16a3bb0173bb921a5160a55136e1d9_7bpdhbcCL2KMLie3oGjH.xml
  config = {
    host: "fbrss.com",
    path: "/f/cd16a3bb0173bb921a5160a55136e1d9_7bpdhbcCL2KMLie3oGjH.xml",
    port: 80
  };

  body = "";
  var items = [];

  http.get(config, function(fetch) {
    fetch.on("data", function(chunk) {
      body+=chunk;
    });
    fetch.on("end", function() {
      simplexml.parse(body, function(e, parsed) {
        if(e){
          items = [];
        } else {
          items.push(parsed.channel.item);
        }

      });
      // console.log(items);
      res.render('feed', { items: items, state: req.params.state });
    });

  }).on('error', function(e) {
    items = [];
    res.render('feed', { items: items, state: req.params.state });
  });
};



