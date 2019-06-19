
var express = require('express'),
	http = require('http'),
	path = require('path'),
	socketIO = require('socket.io'),
	app = express(),
	server = http.Server(app),
	io = socketIO(server),
	bullets = [];

app.use(express.static('public'));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

const gameState = {
	players: {}
}

//calling the heartbeat function 60 times per second
setInterval(heartbeat, 1000/60);
//emiting the state of the game which is a list of objects each with an x y and direction
function heartbeat(){
	//can add bullets to gameState and have gameState sent to the clients instead of gameState.players
	io.sockets.emit('heartbeat', gameState.players);
}

io.sockets.on('connection', function(socket){
	console.log('connected.');
	//adding the connected player to our map
	socket.on('start', function(data){
		gameState.players[socket.id] = {
			x: data.x,
			y: data.y,
			dir: data.dir
		};
	});
	//updating the players on the gameState to be sent by the heartbeat function to all other clients.
	socket.on('update', function(data){
		var player = gameState.players[socket.id] || {};
		player.x = data.x;
		player.y = data.y;
		player.dir = data.dir;
	});

	socket.on('disconnect', function(){
		console.log('disconnected.');
		delete gameState.players[socket.id];
	});
});

server.listen(3000, function() {
	console.log('Starting server on port 3000');
});
