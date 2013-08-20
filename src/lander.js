var Lander = function(_, settings) {
  this.name = "lander";

  for (var i in settings) {
    this[i] = settings[i];
  }
  this.size = {x: 25, y: 25};
  this.pos.rot = -90;

  // velocity
  this.vx = 0;
  this.vy = 0;

  this.firing = false;
};

Lander.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.pos.x + this.size.x/2,
                this.pos.y + this.size.y/2);
  ctx.rotate(Math.PI/180 * this.pos.rot);
  ctx.fillStyle = this.color;
  
  // because of translate, x/y pos here are relative to center of lander (0,0)
  // also because of translate, x/y seem to reversed.
  ctx.fillRect(0 - this.size.x/2, 0 - this.size.y/2, 
               this.size.x, this.size.y);

  if (this.firing) {
    ctx.fillStyle = "red";
    ctx.fillRect(10 - this.size.x, -this.size.y/2,
                 5, this.size.y);
  }

  ctx.restore();
};

Lander.prototype.update = function(dt) {
  var GRAVITY_ACCEL = 0.3;
  var THRUST_ACCEL = 0.6;

  var step = dt/100; // arbitrary tiny number

  // Check player input
  var thrustAccel = 0;
  this.firing = false;
  if (coq.inputter.state(coq.inputter.SPACE) ||
      coq.inputter.state(coq.inputter.UP_ARROW)) {
    thrustAccel = THRUST_ACCEL;
    this.firing = true;
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
  var vec = calcVector(thrustAccel, this.pos.rot);

  // Apply gravity
  vec.y += GRAVITY_ACCEL;

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
  if (other.name === "ground") {
    this.pos.y = other.pos.y - this.size.y;
    this.vx = 0;
    this.vy = 0;
  } else if (other.name === "collectable") {
    coq.entities.destroy(other);
    // todo: increment score
    // where should score be stored? look @ https://github.com/maryrosecook/coquette/tree/master/demos/advanced
    // for global state design
  }
};

function calcVector(magnitude, angle) {
  var rad = angle * Math.PI/180;
  var x = magnitude * Math.cos(rad);
  var y = magnitude * Math.sin(rad);
  return { x: x, y: y };
}

export default Lander;
