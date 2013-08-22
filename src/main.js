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

  if (this.fsm.is("playing")) {
    // Score
    ctx.textAlign = "left";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Score: " + this.score, 10, 495);

    // Timer
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.font = "bold 120px sans-serif";

    // ugh javascript y u no strfmt
    var displayTime = ("" + this.timer).split('');
    displayTime.pop(); // drop last digit
    displayTime.pop(); // okay now I just feel dumb.
    displayTime.splice(displayTime.length - 1, 0, ".");
    displayTime = displayTime.join('');

    ctx.fillText(displayTime, 250, 275);
  }
  if (this.fsm.is("attract")) {
    ctx.textAlign = "center";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText("MOMENTUM", 250, 250);
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("Press [space] to start", 250, 300);
  }
  if (this.fsm.is("dead")) {
    ctx.textAlign = "center";
    ctx.font = "bold 72px sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 250, 200);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(this.reason, 250, 250);
    ctx.fillText("your final score: " + this.score, 250, 300);
    ctx.fillText("press R to restart", 250, 350);
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
  } else if (this.fsm.is("playing")) {
    this.timer -= dt;
    if (this.timer < 0) {
      this.fsm.died("you ran out of time!");
    }
  }
};

Game.prototype.start = function() {
  coq.entities.create(Lander, {
    pos: { x: 225, y: 280 }, color: "#fff"
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

  coq.runner.enqueue(this, this.generateCollectable.bind(this));

  this.score = 0;
  this.timer = 7000;
};

Game.prototype.died = function(event, old, new_, reason) {
  console.log(arguments);
  var all = coq.entities.all();

  this.reason = reason;

  for (var entity in all) {
    coq.entities.destroy(all[entity]);
  }
};

Game.prototype.collected = function(other) {
  coq.entities.destroy(other);
  this.score += 1;
  this.generateCollectable();
};

Game.prototype.generateCollectable = function() {
  var collectablePos = {
    x: Math.floor(Math.random() * 425) + 25,
    y: Math.floor(Math.random() * 400) + 25
  };

  coq.entities.create(Collectable, {
    pos: collectablePos, size: {x: 20, y: 20}, color: "fff"
  });

  // add to timer based on distance
  var playerPos = coq.entities.all(Lander)[0].pos;
  var distance = Coquette.Collider.Maths.distance(collectablePos, playerPos);

  this.timer += Math.floor(distance) * 25;
};

new Game("container", 500, 500);
