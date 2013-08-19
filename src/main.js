import Lander from "lander/lander";
import Ground from "lander/ground";

var Game = function(canvasId, width, height) {
  window.coq = new Coquette(this, canvasId, width, height, "#000");

  coq.entities.create(Lander, {
    pos: { x: 225, y: 280 }, color: "#099"
  });
  coq.entities.create(Ground, {
    pos: {x: 50, y: 325 }, size: {x: 400, y: 25}, color: "#333"
  });
};

new Game("container", 500, 500);
