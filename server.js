#!/bin/env node
//  OpenShift sample Node application
var express    = require('express');
var fs         = require('fs');
var http       = require('http');
var jwt        = require("jsonwebtoken");
var bodyParser = require("body-parser");

var SampleApp = function() {

  var self = this;
  self.users = [];

  self.setupVariables = function() {
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };

  self.createRoutes = function() {
    self.routes = { };

    self.routes['/'] = function(req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.send(fs.readFileSync('./index.html'));
    };

    self.routes['/isauth'] = function(req, res) {
      var token = req.headers.authorization;
      var exists = false;

      for(var i = 0; i < self.users.length;i++){
        if(self.users[i].token == token){
          i = self.users.length;
          exists = true;
        }
      }

      if(exists){
        res.status(200).send("ok");
      } else {
        res.status(403).send("Forbidden");
      }

    };

    self.post_routes = { };

    self.post_routes['/login'] = function(req, res){
      if(res){
        var body = req.body;

        if(body.username && body.password){
          var token = jwt.sign(body, 'HS256');

          self.users.push({token: token, user: body});
          res.status(200).send({token: token});
        } else {
          res.status(403).send("Du kommst hier nicht rein!");
        }
      }
    };

    self.post_routes['/logout'] = function(req, res){
      if(res){
        var body = req.body;

        if(body.token){
          var isLogout = false;

          for(var i = 0; i < self.users.length;i++){
            if(self.users[i].token == body.token){
              self.users.splice(i, 1);
              i = self.users.length;
              isLogout = true;
            }
          }

          if(isLogout){
            res.status(200).send("Success");
          } else {
            res.status(200).send("No User found");
          }
        } else {
          res.status(403).send("Du kommst hier nicht rein!");
        }
      }
    };
  };

  self.setHeader = function(){
    self.app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

      next();
    });
  };

  self.setPublic = function(){
    self.app.use('/public', express.static(__dirname + '/public'));
  };

  self.setGet = function(){
    for (var r in self.routes) {
      self.app.get(r, self.routes[r]);
    }
  };

  self.setPost = function(){
    for (var r in self.post_routes) {
      self.app.post(r, self.post_routes[r]);
    }
  };

  self.initializeServer = function() {
    self.app = express();
    self.app.use(bodyParser.urlencoded({ extended: true }));
    self.app.use(bodyParser.json());

    self.createRoutes();
    self.setHeader();
    self.setPublic();
    self.setGet();
    self.setPost();
  };

  self.initialize = function() {
    self.setupVariables();
    self.initializeServer();
  };

  self.start = function() {
    process.on('uncaughtException', function(ex) {
      console.log("EXCEPTION");
      console.log(ex);
    });

    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
          Date(Date.now() ), self.ipaddress, self.port);
    });
  };

};


var zapp = new SampleApp();
zapp.initialize();
zapp.start();

