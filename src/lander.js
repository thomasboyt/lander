var Lander = function(_, settings) {
  for (var i in settings) {
    this[i] = settings[i];
  }
  this.size = {x: 25, y: 25};
  this.pos.rot = -90;

  // velocity
  this.vx = 0;
  this.vy = 0;

  // acceleration
  this.ax = 0;
  this.ay = 0;

  this.thrustVelocity = 0;
  this.thrustAccel = 0;
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

Lander.prototype.update = function(dt) {
  var step = dt/100; // arbitrary tiny number

  // Check player input
  if (coq.inputter.state(coq.inputter.SPACE)) {
    this.thrustAccel = 0.6;
  } else {
    this.thrustAccel = 0;
  }
  if (coq.inputter.state(coq.inputter.F)) {
    this.pos.rot -= 1;
  }
  if (coq.inputter.state(coq.inputter.J)) {
    this.pos.rot += 1;
  }

  // max accel
  //if (this.thrustAccel > 0.05) this.thrustAccel = 0.05;
  
  // top speed
  //if (this.thrustVelocity > 0.3) this.thrustVelocity = 0.3;

  // Get move vector based on thrust velocity and rotation
  this.thrustVelocity += this.thrustAccel * step;
  var vec = calcVector(this.thrustAccel, this.pos.rot);

  // Apply gravity
  this.ay = 0.3;
  vec.y += this.ay;

  // Apply new vector to our velocity
  this.vx += vec.x * step;
  this.vy += vec.y * step;

  // Apply velocity to position
  this.pos.x += this.vx * step;
  this.pos.y += this.vy * step;

  document.getElementById("vx").innerHTML = this.vx;
  document.getElementById("vy").innerHTML = this.vy;
  document.getElementById("ay").innerHTML = this.ay;
  document.getElementById("vel").innerHTML = this.thrustVelocity;
  document.getElementById("acc").innerHTML = this.thrustAccel;
  document.getElementById("x").innerHTML = vec.x;
  document.getElementById("y").innerHTML = vec.y;
  document.getElementById("rot").innerHTML = this.pos.rot;
};

Lander.prototype.collision = function(other) {
  // TODO: collision magic
  // FOR NOW: go through things or get stuck in them
  this.pos.y = other.pos.y - this.size.y;
  this.thrustVelocity = 0;
  this.vx = 0;
  this.vy = 0;
  //this.ay = 0;
};

function calcVector(magnitude, angle) {
  var rad = angle * Math.PI/180;
  var x = magnitude * Math.cos(rad);
  var y = magnitude * Math.sin(rad);
  return { x: x, y: y };
}

export default Lander;
