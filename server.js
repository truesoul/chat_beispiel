#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var http = require('http');

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


  self.populateCache = function() {
    self.zcache = {'index.html':fs.readFileSync('./index.html')};
  };

  self.cache_get = function(key) { return self.zcache[key]; };

  self.createRoutes = function() {
    self.routes = { };

    self.routes['/'] = function(req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.send(self.cache_get('index.html') );
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

  self.initializeServer = function() {
    self.app = express();
    self.createRoutes();
    self.setHeader();
    self.setPublic();
    self.setGet();
  };

  self.initialize = function() {
    self.setupVariables();
    self.populateCache();

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

