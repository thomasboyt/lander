var Lander = function(_, settings) {
  for (var i in settings) {
    this[i] = settings[i];
  }
  this.size = {x: 25, y: 25};
  this.draw = function(ctx) {
    ctx.fillStyle = settings.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  };

 // velocity
  this.vx = 0;
  this.vy = 0;

  // acceleration
  this.ax = 0;
  this.ay = 0;
};

Lander.prototype.update = function(dt) {
  var step = dt/300;
  if (coq.inputter.state(coq.inputter.UP_ARROW)) {
    // weird acceleration curve thing
    if (this.ay > 0) this.ay = Math.sin(this.ay);

    this.ay -= 0.5;
  }

  function sgn(x) {
    return (x > 0) - (x < 0);
  }

  // top speed
  /*if (Math.abs(this.vy) > 20) this.vy = 20 * sgn(this.vy);
  if (this.vy < -20) this.vy = -20;*/

  // top acceleration
  //if (Math.abs(this.ay) > 10) this.ay = 20 * sgn(this.vy);

  // apply gravity
  this.ay += 0.2;

  // update velocity
  this.vx += this.ax * step;
  this.vy += this.ay * step;

  // update position based on velocity
  this.pos.x += this.vx * step;
  this.pos.y += this.vy * step;

  // logging
  document.getElementById("ay").innerHTML = this.ay;
  document.getElementById("vy").innerHTML = this.vy;
};

Lander.prototype.collision = function(other) {
  // do collision magic

  this.pos.y = other.pos.y - this.size.y;
  this.ay = 0;
  this.vy = 0;
};

export default Lander;
