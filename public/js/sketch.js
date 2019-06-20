//TODO: make a clientBullets array and have them move with render and update and pass only their x and y coordinates to the server and have the server emit those and using those x and y coordinates create new points at the given x and y 

var socket = io();
var clientShip;
var ships = {};
var clientBullets = [];
var bullets = [];

function setup(){
	var canvas = createCanvas(windowWidth * 0.75, windowHeight * 0.87);
	canvas.parent('sketch-holder');
	clientShip = new ship(random(width), random(height),0);

	var data = {
		x: clientShip.pos.x,
		y: clientShip.pos.y,
		dir: clientShip.direction
	};

	socket.emit('start', data);
}

function draw(){
	background(0);

	socket.on('heartbeat', function(data){
		ships = data.players;
		clientBullets = data.bullets;
	});

	for(var id in ships){
		if(socket.id !== id){
			//translate from different functions stack ontop of each other but by using push() and pop() the states of the objects is saved before each translation.
			push();
			translate(ships[id].x, ships[id].y);
			rotate(ships[id].dir);
			noFill();
			stroke(255);
			triangle(-20, 20, 20,20, 0,-20);
			pop();
		}
	}
	//calculations and rendering on the client side.
	clientShip.render();
	clientShip.update();
	clientShip.turn();


	//emiting the object to the server to be stored there and then sent to all other clients.

	/*Bullets*/
	for(var i = 0; i < clientBullets.length;i++){
		//console.log('entered loop');
		var bullet = new Bullet(clientBullets[i].bulletPosX, clientBullets[i].bulletPosY, clientBullets[i].bulletDirection);
		bullet.render();
		bullet.update();
		clientBullets[i].bulletPosX = bullet.pos.x;
		clientBullets[i].bulletPosY = bullet.pos.y;
		if(bullet.pos.x > windowWidth || bullet.pos.x < 0 || bullet.pos.y > windowHeight || bullet.pos.y < 0)
			clientBullets.splice(i, 1);

		//sending the updated coordinates to the server.
		console.log(clientBullets);
}

	//creating an object of the relavent variables after each move
	var data = {
		x: clientShip.pos.x,
		y: clientShip.pos.y,
		dir: clientShip.direction,
		allBullets: clientBullets
	};

	socket.emit('update', data);

	if(keyIsDown(87))
		clientShip.thrusting(true);
	else
		clientShip.thrusting(false);
}

function keyPressed(){
	if(key == ' ')    
		socket.emit('bulletFired', {bulletPosX: clientShip.pos.x, bulletPosY: clientShip.pos.y, bulletDirection: clientShip.direction});
	}
