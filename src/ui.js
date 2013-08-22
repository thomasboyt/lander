var UI = function(game) {
  this.game = game;
  this.boundingBox = coq.collider.NONE;
  this.zindex = -1;
};

UI.prototype.draw = function(ctx) {
  var fsm = this.game.fsm;

  ctx.fillStyle = "#fff";

  // playing HUD
  if (fsm.is("playing")) {
    // Score
    ctx.textAlign = "left";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Score: " + this.game.score, 10, 495);

    // Timer
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.font = "bold 120px sans-serif";

    // ugh javascript y u no strfmt
    var displayTime = ("" + this.game.timer).split('');
    displayTime.pop(); // drop last digit
    displayTime.pop(); // lol
    displayTime.splice(displayTime.length - 1, 0, ".");
    displayTime = displayTime.join('');

    ctx.fillText(displayTime, 250, 275);
  }

  // title scren
  if (fsm.is("attract")) {
    ctx.textAlign = "center";

    ctx.font = "bold 72px sans-serif";
    ctx.fillText("MOMENTUM", 250, 250);

    ctx.font = "bold 42px sans-serif";
    ctx.fillText("Press [space] to start", 250, 300);
  }

  // game over screen
  if (fsm.is("dead")) {
    ctx.textAlign = "center";

    ctx.font = "bold 72px sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 250, 200);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(this.game.reason, 250, 250);
    ctx.fillText("your final score: " + this.game.score, 250, 300);
    ctx.fillText("press R to restart", 250, 350);
  }
};

export default UI;
