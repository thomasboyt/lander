var Ground = function(_, settings) {
 for (var i in settings) {
    this[i] = settings[i];
  }
  this.draw = function(ctx) {
    ctx.fillStyle = settings.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }; 
};

export default Ground;
