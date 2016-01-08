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
  self.users = [];

  self.setupVariables = function() {
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };


  /**
   *  Populate the cache.
   */
  self.populateCache = function() {
    self.zcache = {'index.html':fs.readFileSync('./index.html')};
  };


  /**
   *  Retrieve entry (content) from cache.
   *  @param {string} key  Key identifying content to retrieve from cache.
   */
  self.cache_get = function(key) { return self.zcache[key]; };


  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig){
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
          Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() { self.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() { self.terminator(element); });
    });
  };


  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Create the routing table entries + handlers for the application.
   */
  self.createRoutes = function() {
    self.routes = { };

    self.routes['/'] = function(req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.send(self.cache_get('index.html') );
    };

    self.routes['/isauth'] = function(req, res) {
      var token = req.headers.authorization;

      USERS.findToken(token, function (exists) {
        if(exists){
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
  };


  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
    self.createRoutes();
    self.app = express();

    // Setze Header : Access-Control-Allow-Origin * erlaubt alle Anfrage von außen
    self.app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

      next();
    });

    self.app.use('/public', express.static(__dirname + '/public'));

    self.app.use(bodyParser.urlencoded({ extended: true }));
    self.app.use(bodyParser.json());

    //  Add handlers for the app (from the routes).
    for (var r in self.routes) {
      self.app.get(r, self.routes[r]);
    }

    self.app.post('/login', function(req, res){
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
    });

    self.app.post('/logout', function(req, res){
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
    });

    self.server = http.createServer(self.app);
  };


  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.populateCache();
    self.setupTerminationHandlers();

    // Create the express server and routes.
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

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

