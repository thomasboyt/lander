var Collectable = function(_, settings) {
  this.boundingBox = coq.collider.CIRCLE;
  for (var i in settings) {
    this[i] = settings[i];
  }
};

Collectable.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.strokeStyle = "#000";
  ctx.arc(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2,
          this.size.x / 2, 0, 2*Math.PI);
  ctx.fill();
};

export default Collectable;
