var scoreUser = 0; //score of the User
var scoreCPU = 0; // score of the CPU
var gameover = true; // boolean that determine if the game is over starts as true to show the menu screen
var winner = ""; //winner first to get to 10 point
var cpuSpeed = 0.5; //default cpu speed
class Game {
  constructor() {
    this.canvas = document.getElementById("table");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
  }
  update() {
    var lSpritesLength = this.sprites.length;
    for (var i = 0; i < lSpritesLength; i++) {
      this.sprites[i].update();
    }
  }
  addSprites(pSprites) {
    this.sprites.push(pSprites);
  }
  draw() {
    this.ctx.clearRect(0, 0, 600, 400);
    drawEnv(this.ctx);
    var lSpritesLength = this.sprites.length;
    for (var i = 0; i < lSpritesLength; i++) {
      this.sprites[i].draw(this.ctx);
    }
  }
}
var keysDown = {};

addEventListener(
  "keydown",
  function (e) {
    keysDown[e.keyCode] = true;
  },
  false
); //keydown event listener

addEventListener(
  "keyup",
  function (e) {
    delete keysDown[e.keyCode];
  },
  false
); //keyup event listener

class Sprite {
  constructor() {}
  update() {}
  draw() {}
}
class Ball extends Sprite {
  constructor(centerX, centerY, radius, color, uPadel, cpu) {
    super();
    this.cX = centerX;
    this.cY = centerY;
    this.radius = radius;
    this.color = color;
    this.dx = -1;
    this.dy = 1;
    this.user = uPadel;
    this.comp = cpu;
  }
  getBallX() {
    return this.cX;
  }
  getBallY() {
    return this.cY;
  }
  getBallDx() {
    return this.dx;
  }
  getBallDy() {
    return this.dy;
  }
  update() {
    if (!gameover) {
      //if game is not over
      if (
        this.cX + this.radius > 570 &&
        this.cY > this.comp.pY - 5 &&
        this.cY < this.comp.pY + this.user.padelHeight + 5 && //+5 in lines 81 and 82 are used to make colliso smoother
        this.cX < 570
      ) {
        this.dx = -1; //collision with cpu
      }
      if (
        this.cX - this.radius < 30 &&
        this.cY > this.user.pY - 5 &&
        this.cY < this.user.pY + this.user.padelHeight + 5 && //+5 in lines 89 and 90 are used to make colliso smoother
        this.cX > 30
      ) {
        this.dx = 1; // collision with user
      }
      if (this.cY + this.radius >= 400) {
        this.dy = -1; //collision with lower border
      }
      if (this.cY - this.radius < 0) {
        this.dy = 1; //collision with uooer border
      }

      this.cX += this.dx; //move ball on x axis
      this.cY += this.dy; //move ball on y axis

      //incriment score of the scorer and reset ball to middle
      if (this.cX < 0) {
        this.cX = 300;
        this.cY = 200;
        scoreCPU++;
      }
      if (this.cX > 600) {
        this.cX = 300;
        this.cY = 200;
        scoreUser++;
      }

      //check if we have a winner and who  he is
      if (scoreCPU == 10) {
        winner = "CPU";
        gameover = true;
      }
      if (scoreUser == 10) {
        winner = "User";
        gameover = true;
      }
    }
    if (gameover) {
      if (82 in keysDown) {
        //press r to reset value and get menu (first) screen
        scoreCPU = 0;
        scoreUser = 0;
        winner = "";
      }
      if (32 in keysDown) {
        //start game by pressing space after choosing difficulty
        gameover = false;
      }
      //set cpu speed based on chosen difficulty
      if (97 in keysDown) {
        cpuSpeed = 0.5;
      } else if (98 in keysDown) {
        cpuSpeed = 0.65;
      } else if (99 in keysDown) {
        cpuSpeed = 0.9;
      }
      compPadel.setDy(cpuSpeed); //setter for cpu speed
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.cX, this.cY, this.radius, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.beginPath();
    ctx.font = "30px Verdana";
    ctx.fillStyle = "Yellow";
    ctx.fillText(scoreUser + "   " + scoreCPU, 264, 30); //score display
    if (winner != null) {
      if (winner == "CPU") {
        //Cpu won display
        ctx.beginPath();
        ctx.font = "30px Ariel";
        ctx.fillStyle = "Red";
        ctx.fillText("Sorry you lost press R to play again", 50, 300);
      }
      if (winner == "User") {
        //user won display
        ctx.beginPath();
        ctx.font = "30px Ariel";
        ctx.fillStyle = "Green";
        ctx.fillText("Congratulations, press R to play again", 50, 300);
      }
    }
    if (winner == "" && gameover) {
      //menu screen
      ctx.beginPath();
      ctx.font = "30px Ariel";
      ctx.fillStyle = "Green";
      ctx.fillText("Pick difficulty then Press space to start", 70, 100);
      ctx.fillStyle = "Red";
      ctx.fillText("1 for easy", 70, 180);
      ctx.fillText("2 for medium", 70, 210);
      ctx.fillText("3 for hard", 70, 240);
    }
  }
}
class UserPadel extends Sprite {
  constructor(padelX, padelY, padelLength, padelHeight, color) {
    super();
    this.pX = padelX;
    this.pY = padelY;
    this.padelLength = padelLength;
    this.padelHeight = padelHeight;
    this.color = color;
  }
  update() {
    if (!gameover) {
      if (38 in keysDown) {
        //move user padel based on user input
        if (this.pY > 3) {
          this.pY -= 2;
        }
      }
      if (40 in keysDown) {
        if (this.pY < 347) {
          this.pY += 2;
        }
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.pX, this.pY, this.padelLength, this.padelHeight);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class cpuPadel extends Sprite {
  constructor(padelX, padelY, padelLength, padelHeight, color) {
    super();
    this.pX = padelX;
    this.pY = padelY;
    this.dx = 1;
    this.dy = cpuSpeed;
    this.padelLength = padelLength;
    this.padelHeight = padelHeight;
    this.color = color;
  }
  setDy(compSpeed) {
    this.dy = compSpeed;
  }
  update() {
    if (!gameover) {
      if (ball.getBallX() > 590 || ball.getBallX() < 10) {
        //move cpu padel based on ball movement
        this.pY = 200;
      }
      if (ball.getBallDy() < 0) {
        if (this.dy > 0) this.dy *= -1;
      }
      if (ball.getBallDy() > 0) {
        if (this.dy < 0) this.dy *= -1;
      }
      if (this.pY + this.padelHeight < 400) this.pY += this.dy;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.pX, this.pY, this.padelLength, this.padelHeight);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

var myGame = new Game(); //create game

var uPadel = new UserPadel(20, 175, 10, 50, "red");
var compPadel = new cpuPadel(570, 175, 10, 50, "purple");
var ball = new Ball(300, 200, 10, "orange", uPadel, compPadel); //create game elements

myGame.addSprites(ball);
myGame.addSprites(uPadel);
myGame.addSprites(compPadel); //add sprites
function animate() {
  myGame.update();
  myGame.draw();
  requestAnimationFrame(animate);
}

function drawEnv(context) {
  //draw blue board and line in the middle
  drawRect(context, 0, 0, 600, 400);
  drawLine(context, 300, 0);
}
function drawRect(context, x, y, l, h) {
  context.beginPath();
  context.rect(x, y, l, h);
  context.lineWidth = 5;
  context.strokeStyle = "#000000";
  context.fillStyle = "blue";
  context.fillRect(x, y, l, h);
  context.stroke();
}
function drawLine(context, x, y) {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(300, 600);
  context.lineWidth = 5;
  context.strokeStyle = "#000000";
  context.stroke();
}

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (f) {
    return setTimeout(f, 1000 / 60);
  };

animate();
