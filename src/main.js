import Lander from "lander/lander";
import Wall from "lander/wall";
import Collectable from "lander/collectable";

var Game = function(canvasId, width, height) {
  window.coq = new Coquette(this, canvasId, width, height, "#000");

  this.fsm = StateMachine.create({
    initial: 'attract',
    events: [
      { name: 'start', from: ['attract', 'dead'], to: 'playing' },
      { name: 'died', from: 'playing', to: 'dead' },
      { name: 'pause', from: 'playing', to: 'paused' },
      { name: 'unpause', from: 'paused', to: 'playing' }
    ],
    callbacks: {
      onenterplaying: this.start.bind(this),
      ondied: this.died.bind(this),
      onenterstate: function(e, f, t) {
        console.log('event:', e, '; transition:', f, '=>', t);
      }
    }
  });
};

Game.prototype.draw = function(ctx) {
  // this seems to be an okay place to render a UI?
  // (can always split it out to an entity if needed)
  ctx.fillStyle = "#fff";

  if (!this.fsm.is("attract")) {
    ctx.textAlign = "left";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Score: " + this.score, 10, 490);
  }
  if (this.fsm.is("attract")) {
    ctx.textAlign = "left";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("1. Get the blue things", 5, 200);
    ctx.fillText("2. Don't hit the walls", 5, 250);
    ctx.fillText("3. Press [space] to start", 5, 300);
    //ctx.textAlign = "center";
    //ctx.font = "bold 32px sans-serif";
  }
  if (this.fsm.is("dead")) {
    ctx.textAlign = "center";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText("YOU DIED :(", 250, 250);
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("press R to restart", 250, 300);
  }
};

Game.prototype.update = function(dt) {
  if (this.fsm.is("attract")) {
    if (coq.inputter.state(coq.inputter.SPACE)) {
      this.fsm.start();
    }
  } else if (this.fsm.is("dead")) {
    if (coq.inputter.state(coq.inputter.R)) {
      this.fsm.start();
    }
  }
};

Game.prototype.start = function() {
  coq.entities.create(Lander, {
    pos: { x: 225, y: 280 }, color: "#099"
  });

  // top
  coq.entities.create(Wall, {
    pos: {x: 0, y: 0 }, size: {x: 500, y: 25}, color: "#333"
  });

  // bottom
  coq.entities.create(Wall, {
    pos: {x: 0, y: 450 }, size: {x: 500, y: 25}, color: "#333"
  });

  // left
  coq.entities.create(Wall, {
    pos: {x: 0, y: 25 }, size: {x: 25, y: 450}, color: "#333"
  });

  // right
  coq.entities.create(Wall, {
    pos: {x: 475, y: 25 }, size: {x: 25, y: 450}, color: "#333"
  });

  this.generateCollectable();

  this.score = 0;
};

Game.prototype.died = function() {
  var all = coq.entities.all();

  for (var entity in all) {
    coq.entities.destroy(all[entity]);
  }
};


Game.prototype.generateCollectable = function() {
  var x = Math.floor(Math.random() * 425) + 25;
  var y = Math.floor(Math.random() * 425) + 25;
  coq.entities.create(Collectable, {
    pos: {x: x, y: y }, size: {x: 20, y: 20}, color: "blue"
  });
};

new Game("container", 500, 500);
