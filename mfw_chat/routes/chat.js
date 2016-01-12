var port = process.env.PORT || 5000;
var server;
var io;
 
function CHAT(app){

    var self = this;
    server = require('http').createServer(app);;
    io = require('../')(server);
    self.listenConnection();
};

CHAT.prototype.listenConnection = function() {
    server.listen(port, function () {
      console.log('Server listening at port %d', port);
    });
    // Chatroom

    var numUsers = 0;

    io.on('connection', function (socket) {

      socket.on('login', function (data) {
        socket.topicID = data.topicID;
        ++numUsers;      
        socket.join(data.topicID);
      });
      
      // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        console.log('topicname :%s',socket.topicID);
        socket.to(socket.topicID).emit('new message', {
         username: socket.username,
         message: data
        });
        //connection.insertMessage(data);
    });


  });
}

module.exports = CHAT;
