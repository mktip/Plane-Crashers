var socket = io();
var clientShip;
var ships = {};

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
        //translate from different function stack ontop of each other but by using push() and pop() the states of the objects is saved before and after each move.
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

  clientShip.render();
  clientShip.update();
  clientShip.turn();

  var data = {
    x: clientShip.pos.x,
    y: clientShip.pos.y,
    dir: clientShip.direction
  };

  socket.emit('update', data);

}

function keyPressed(){
//W key
  if(keyCode == 87){
    clientShip.thrusting(true);
  }
}
function keyReleased(){
  if(keyCode == 87){
    clientShip.thrusting(false);
  }
}
