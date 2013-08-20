import Lander from "lander/lander";
import Ground from "lander/ground";
import Collectable from "lander/collectable";

var Game = function(canvasId, width, height) {
  window.coq = new Coquette(this, canvasId, width, height, "#000");

  coq.entities.create(Lander, {
    pos: { x: 225, y: 280 }, color: "#099"
  });
  coq.entities.create(Ground, {
    pos: {x: 50, y: 325 }, size: {x: 400, y: 25}, color: "#333"
  });
  coq.entities.create(Collectable, {
    pos: {x: 240, y: 75 }, size: {x: 20, y: 20}, color: "blue"
  });
};

new Game("container", 500, 500);
