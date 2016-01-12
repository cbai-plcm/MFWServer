var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./routes/rest.js");
var chat = require("./routes/chat.js");
var app  = express();
app.use(express.static(__dirname + '/chat'));
function REST(){
    var self = this;
    self.initialize();
};

REST.prototype.initialize = function() {
    var self = this;     
    self.configureExpress();
    var chatroom = new chat(app);
}

REST.prototype.configureExpress = function(database) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router);
      self.startServer();
}

REST.prototype.startServer = function() {
      //app.listen(3000,function(){
        //  console.log("All right ! I am alive at Port 3000.");
      //});
}

REST.prototype.stop = function(err) {
    process.exit(1);
}

new REST();
/*

// Setup basic express server
var bodyParser  = require("body-parser");
var rest = require("./routes/rest.js");

var express = require('express');
var app = express();
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/', router);
      var rest_router = new rest(router);


var server = require('http').createServer(app);
var io = require('.')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/chat'));*/