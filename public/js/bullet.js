function Bullet(shipPosX, shipPosY, direction){
	this.pos = createVector(shipPosX, shipPosY);
	this.vel = p5.Vector.fromAngle(direction-PI/2); //gives a vector in the direction of the given angle.
	this.vel.mult(10);
	this.extraPos = p5.Vector.fromAngle(direction-PI/2); //creating a vector that is in the direction the ship is pointing at
	this.extraPos.mult(25); //scaling that vector ahead
	this.pos.add(this.extraPos); //adding the scaled vector to the initial position of the bullet so it spawns from the tip of the ship.
	this.update = function(){
		this.pos.add(this.vel);
	}	
	this.render = function(){
		push();
		stroke(255);
		strokeWeight(4); //giving the stroke some thickness
		point(this.pos.x, this.pos.y);
		pop();
	}
}
