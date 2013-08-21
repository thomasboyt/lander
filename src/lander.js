import { calcVector } from "lander/util";
import Collectable from "lander/collectable";
import Ground from "lander/ground";

var Lander = function(game, settings) {
  this.game = game;

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
  if (other instanceof Ground) {
    // TODO: actual collision displacement fixing
    // for now this just keeps you from falling thru the ground by putting you on top of it
    this.pos.y = other.pos.y - this.size.y;
    this.vx = 0;
    this.vy = 0;
  } else if (other instanceof Collectable) {
    // TODO: insert a satisfying blip here
    coq.entities.destroy(other);
    this.game.score += 1;
  }
};



export default Lander;
