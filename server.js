var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});



io.on('connection', function(socket){
    console.log('connected.')



  io.on('disconnect', function(){
    console.log('disconnected.')
  });
});

server.listen(3000, function() {
  console.log('Starting server on port 3000');
});
