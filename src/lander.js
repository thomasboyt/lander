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
  if (coq.inputter.state(coq.inputter.SPACE) ||
      coq.inputter.state(coq.inputter.UP_ARROW)) {
    this.thrustAccel = 0.6;
  } else {
    this.thrustAccel = 0;
  }
  if (coq.inputter.state(coq.inputter.F) ||
      coq.inputter.state(coq.inputter.LEFT_ARROW)) {
    this.pos.rot -= 1;
  }
  if (coq.inputter.state(coq.inputter.J) ||
      coq.inputter.state(coq.inputter.RIGHT_ARROW)) {
    this.pos.rot += 1;
  }

  // Get acceleration vector based on thrust accel and rotation
  var vec = calcVector(this.thrustAccel, this.pos.rot);

  // Apply gravity
  this.ay = 0.3;
  vec.y += this.ay;

  // Apply acceleration vector to our velocity
  this.vx += vec.x * step;
  this.vy += vec.y * step;

  // Apply velocity to position
  this.pos.x += this.vx * step;
  this.pos.y += this.vy * step;
};

Lander.prototype.collision = function(other) {
  // TODO: collision magic
  // FOR NOW: go through things or get stuck in them
  this.pos.y = other.pos.y - this.size.y;
  this.vx = 0;
  this.vy = 0;
};

function calcVector(magnitude, angle) {
  var rad = angle * Math.PI/180;
  var x = magnitude * Math.cos(rad);
  var y = magnitude * Math.sin(rad);
  return { x: x, y: y };
}

export default Lander;
