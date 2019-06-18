
var express = require('express'),
 http = require('http'),
 path = require('path'),
 socketIO = require('socket.io'),
 app = express(),
 server = http.Server(app),
 io = socketIO(server),
 ships = [];

 app.use(express.static('public'));

 app.get('/', function(request, response) {
   response.sendFile(path.join(__dirname, 'index.html'));
 });

const gameState = {
  players: {}
}

setInterval(heartbeat, 1000/60);
function heartbeat(){
  io.sockets.emit('heartbeat', gameState.players);
}

io.sockets.on('connection', function(socket){
    console.log('connected.');
    socket.on('start', function(data){

      gameState.players[socket.id] = {
        x: data.x,
        y: data.y,
        dir: data.dir
      };
      console.log('server start: ' + data.dir)

    });
    //updating
    socket.on('update', function(data){
      var player = gameState.players[socket.id] || {};
      player.x = data.x;
      player.y = data.y;
      player.dir = data.dir;
      console.log('server update: ' + player.dir);


    });

  socket.on('disconnect', function(){
    console.log('disconnected.');
    delete gameState.players[socket.id];
  });
});

server.listen(3000, function() {
  console.log('Starting server on port 3000');
});
