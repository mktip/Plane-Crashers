function ship(x,y,dir){
  /*Object Variables*/
  this.pos = createVector(x,y);
  this.r = 20;
  this.direction = dir;
  this.velocity = createVector(0,0);
  this.isThrusting = false;

  /*Updating and rendering*/
  this.update = function(){
    if(this.isThrusting){
      this.thrust();
    }
    //adding two vectors to move the ship
    this.pos.add(this.velocity);
    //friction effect
    this.velocity.mult(0.95);
  }

  this.render = function() {
    push();
    //translate translates the coordinate system by an x and y value
    translate(this.pos.x, this.pos.y);
    noFill();
    rotate(this.direction);
    stroke(255);
    triangle(-this.r, this.r, this.r,this.r, 0,-this.r);
    pop();
  }

  /*Movement*/
  this.turn = function(){
    //calculate the angle between the mouse pointer and the tringle
    var angle = Math.atan2(mouseX - this.pos.x, - (mouseY - this.pos.y) );
    this.direction = angle;
  }

  this.thrust = function(){
    //because the force is being added to the right so we subtract PI/2 to make it boost upwards
    var force = p5.Vector.fromAngle(this.direction- PI/2);
    force.mult(0.5);
    this.velocity.add(force);
  }

  this.thrusting = function(state){
    this.isThrusting = state;
  }
}
