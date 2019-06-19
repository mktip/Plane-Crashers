var socket = io();
var clientShip;
var ships = {};
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
		ships = data;
	});

	for(var id in ships){
		if(socket.id !== id){
			//translate from different functions stack ontop of each other but by using push() and pop() the states of the objects is saved before each translation.
			push();
			translate(ships[id].x, ships[id].y);
			console.log('dir: ' + ships[id].dir);
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

	//creating an object of the relavent variables after each move
	var data = {
		x: clientShip.pos.x,
		y: clientShip.pos.y,
		dir: clientShip.direction
	};

	//emiting the object to the server to be stored there and then sent to all other clients.
	socket.emit('update', data);


	for(var i = 0; i < bullets.length;i++){
		bullets[i].render();
		bullets[i].update();
	}
	if(keyIsDown(87))
		clientShip.thrusting(true);
	else
		clientShip.thrusting(false);
}

function keyPressed(){
	if(key == ' ')    
		bullets.push(new Bullet(clientShip.pos, clientShip.direction));
	}
