var socket = io();
var clientShip;
var ships = {};

function setup(){
  createCanvas(1000, 800  );
  clientShip = new ship(random(width), random(height),0);

  var data = {
    x: clientShip.pos.x,
    y: clientShip.pos.y,
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
            noFill();
            stroke(255);
            circle(ships[id].x, ships[id].y, 45);
          }
    }


  clientShip.render();
  clientShip.update();
  clientShip.turn();


  var data = {
    x: clientShip.pos.x,
    y: clientShip.pos.y,
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
