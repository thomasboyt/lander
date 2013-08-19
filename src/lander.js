var Lander = function(_, settings) {
  for (var i in settings) {
    this[i] = settings[i];
  }
  this.size = {x: 25, y: 25};
  this.pos.rot = 90;

  // velocity
  this.vx = 0;
  this.vy = 0;
  this.vel = 0;
};

Lander.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.pos.x + this.size.x/2,
                this.pos.y + this.size.y/2);
  ctx.rotate(Math.PI/180 * this.pos.rot);
  ctx.fillStyle = this.color;
  ctx.fillRect(0 - this.size.x/2, 0 - this.size.y/2, this.size.x, this.size.y);
  ctx.restore();
};

var GRAVITY_VECTOR = calcVector(0.2, 90);
Lander.prototype.update = function(dt) {
  var step = dt/300;
  if (coq.inputter.state(coq.inputter.UP_ARROW)) {
    this.vel = this.vel - 1;
  } 

  if (coq.inputter.state(coq.inputter.LEFT_ARROW)) {
    this.pos.rot -= 1;
  }
  if (coq.inputter.state(coq.inputter.RIGHT_ARROW)) {
    this.pos.rot += 1;
  }

  // update velocity
  
  // step 1: compute x and y components based on current velocity and direction
  var velXY = calcVector(this.vel, this.pos.rot);

  // step 2: add a gravity vector
  velXY = addVectors(velXY, GRAVITY_VECTOR);

  // step 3: compute new velocity from gravity-changed version
  this.vel = sgn(Math.atan2(velXY.y, velXY.x)) * Math.sqrt(Math.pow(velXY.x, 2) + Math.pow(velXY.y, 2));

  // step 4: update the x and y velocity components
  this.vx = velXY.x;
  this.vy = velXY.y;

  // step 5: update position based on velocity
  this.pos.x += this.vx * step;
  this.pos.y += this.vy * step;

  // logging
  document.getElementById("vx").innerHTML = this.vx;
  document.getElementById("vy").innerHTML = this.vy;
  document.getElementById("vel").innerHTML = this.vel;
  document.getElementById("x").innerHTML = this.pos.x;
  document.getElementById("y").innerHTML = this.pos.y;
  document.getElementById("rot").innerHTML = this.pos.rot;
};

Lander.prototype.collision = function(other) {
  // do collision magic

  this.pos.y = other.pos.y - this.size.y;
  this.vel = 0;
};

function calcVector(magnitude, angle) {
  var rad = angle * Math.PI/180;
  var x = magnitude * Math.cos(rad);
  var y = magnitude * Math.sin(rad);
  return { x: x, y: y };
}

function addVectors(vec1, vec2) {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

function sgn(x) {
  return (x > 0) - (x < 0);
}

export default Lander;
