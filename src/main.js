import Lander from "momentum/lander";
import Wall from "momentum/wall";
import Collectable from "momentum/collectable";
import UI from "momentum/ui";

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

  coq.entities.create(UI);
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
  this.timer = 15000;
};

Game.prototype.died = function(event, old, new_, reason) {
  var all = coq.entities.all();

  this.reason = reason;

  for (var entity in all) {
    if (!(all[entity] instanceof UI)) {
      coq.entities.destroy(all[entity]);
    }
  }
};

Game.prototype.collected = function(other) {
  this.timer += other.worth;
  this.score += 1;
  coq.entities.destroy(other);
  this.generateCollectable();
};

Game.prototype.generateCollectable = function() {
  var collectablePos = {
    x: Math.floor(Math.random() * 425) + 25,
    y: Math.floor(Math.random() * 400) + 25
  };

  // add to timer based on distance
  var lander = coq.entities.all(Lander)[0];
  var distance = Coquette.Collider.Maths.distance(collectablePos, lander.pos);

  var worth = Math.floor(distance) * 25;
  if (this.timer > 15000) this.timer = 15000;
  coq.entities.create(Collectable, {
    pos: collectablePos, size: {x: 20, y: 20}, color: "#fff", worth: worth
  });

};

new Game("container", 500, 500);
