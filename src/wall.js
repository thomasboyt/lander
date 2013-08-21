var Wall = function(_, settings) {
  for (var i in settings) {
    this[i] = settings[i];
  }
};

Wall.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

export default Wall;
