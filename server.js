#!/bin/env node
//  OpenShift sample Node application
var express    = require('express');
var fs         = require('fs');
var http       = require('http');
var jwt        = require("jsonwebtoken");
var bodyParser = require("body-parser");

var USERS      = require("./scripts/Users.js");

var SampleApp = function() {

  var self = this;

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

    self.routes['/isauth'] = function(req, res) {
      var token = req.headers.authorization;

      USERS.findByToken(token, function (data) {
        if(data){
          res.status(200).send("ok");
        } else {
          res.status(403).send("Forbidden");
        }
      });
    };

    self.routes['/alluser'] = function(req, res) {
      var user = USERS.getAllUser();
      res.status(200).send({data: user});
    };

    self.post_routes = { };

    self.post_routes['/login'] = function(req, res){
      if(res){
        var body = req.body;

        if(body.username && body.password){
          var token = jwt.sign(body, 'HS256');

          USERS.addToUsers({token: token, user: body}, function () {
            res.status(200).send({token: token});
            var result = {command: 'addUser' ,data: {user:body}};
            self.sendToAll(JSON.stringify(result));
          },function () {
            res.status(403).send("Error on Server");
          });

        } else {
          res.status(403).send("Du kommst hier nicht rein!");
        }
      }
    };

    self.post_routes['/logout'] = function(req, res){
      if(res){
        var body = req.body;
        if(body.token){
          USERS.removeUserByToken(body.token, function () {
            res.status(200).send("Success");
            var result = {command: 'removeUser'};
            self.sendToAll(JSON.stringify(result));
          },function () {
            res.status(200).send("No User found");
          });
        } else {
          res.status(200).send("No User found");
        }
      }
    };

    self.post_routes['/addcomment'] = function(req, res){
      if(res){
        var body = req.body;
        if(body.token){
          USERS.findByToken(body.token, function (data) {
            var result = {command: 'addcomment', data: {user: data, message: body.message, color: body.color}};
            self.sendToAll(JSON.stringify(result));
            res.status(200).send("Success");
          },function (data) {
            res.status(200).send("No User found");
          });
        } else {
          res.status(200).send("No User found");
        }
      }
    };
  };

  self.setHeader = function(){
    self.app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, reset_token');

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

    self.server = http.createServer(self.app);
  };

  self.initialize = function() {
    self.setupVariables();
    self.initializeServer();
  };

  self.createWebSocket = function () {
    var WebSocketServer = require('ws').Server;
    self.wss = new WebSocketServer({
      server: self.server,
      autoAcceptConnections: false
    });
    self.wss.on('connection', function(ws) {
      console.log("New connection");
      ws.on('message', function(message) {
        self.sendToAll(message);
      });
      ws.send(JSON.stringify({key: ws.upgradeReq.headers['sec-websocket-key']}));
    });

    self.wss.broadcast = function broadcast(data) {
      self.wss.clients.forEach(function each(client) {
        data.key = client.upgradeReq.headers['sec-websocket-key'];
        client.send(data);
      });
    };
  };

  self.sendToAll = function (data) {
    self.wss.broadcast(data);
  };

  self.start = function() {
    process.on('uncaughtException', function(ex) {
      console.log("EXCEPTION");
      console.log(ex);
    });

    self.server.listen( self.port, self.ipaddress, function() {
      console.log((new Date()) + ' Server is listening on port 8080');
    });
    self.createWebSocket();
  };

};



var zapp = new SampleApp();
zapp.initialize();
zapp.start();

