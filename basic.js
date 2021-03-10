let MOVEMENT = "STILL";
let MOVEMENT_PROBABILITY = [0, 0, 0];
let KEY_IS_PRESSED_DOWN = false;

var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 500;
canvas.height = window.innerHeight / 1.13;
var ctx = canvas.getContext("2d");
var GAMING = true;
var stop;
var move = 0;
var X = [];
var LIFE = 5;
var result = 0;
var Hscore = +sessionStorage.getItem("HSCORE");
var rate = 120;
var compare = 120;
var done = 0;
var BACKGROUNDS = new Audio();
BACKGROUNDS.src = "./assets/audios/backgroundD.mp3";
BACKGROUNDS.volume = "0.25";
var Gati = 8;

var chapter = [];
chapter.push(new Audio());
chapter.push(new Audio());
chapter.push(new Audio());

for (var j = 1; j < 4; j++)
  chapter[j - 1].src = "./assets/audios/chapter" + j + ".mp3";

var onetime = {
  0: true,
  1: true,
  2: true,
};

var gameover = new Audio();
gameover.src = "./assets/audios/gameover.wav";

var complete = new Audio();
complete.src = "./assets/audios/complete.wav";

//Level Maker
var message = [
  { msg: "Chapter One", msg1: "The Beginning" },
  { msg: "Chapter 2", msg1: "Things Gonna Get Crazy Ahead:)" },
  { msg: "Final Chapter", msg1: "Trust Your Instinct" },
];
var Leveln = -1;

var LEVEL = [
  [
    { x: -100, y: 200, dx: 4, dy: 4, radius: 30, score: 1 },
    { x: canvas.width + 440, y: 100, dx: -4, dy: 1, radius: 30, score: 2 },
    { x: -950, y: 150, dx: 1, dy: 3, radius: 30, score: 2 },
    { x: canvas.width + 2800, y: 250, dx: -5, dy: 3, radius: 30, score: 3 },
    { x: canvas.width + 4800, y: 300, dx: -4, dy: 3, radius: 30, score: 4 },
  ],

  [
    { x: -50, y: 210, dx: 1, dy: 3, radius: 30, score: 2 },
    { x: -2100, y: 150, dx: 10, dy: 3, radius: 30, score: 3 },
    { x: -3100, y: 240, dx: 5, dy: 1, radius: 30, score: 3 },
    { x: -100, y: 100, dx: 8, dy: 3, radius: 30, score: 4 },
    { x: canvas.width + 1200, y: 220, dx: -2, dy: 3, radius: 30, score: 4 },
    { x: canvas.width + 2200, y: 300, dx: -5, dy: 1, radius: 30, score: 5 },
    { x: canvas.width + 50, y: 250, dx: -1, dy: 3, radius: 30, score: 1 },
  ],

  [
    { x: -100, y: 150, dx: 8, dy: 3, radius: 30, score: 5 },
    { x: canvas.width + 400, y: 300, dx: -6, dy: 5, radius: 30, score: 14 },
    { x: -900, y: 250, dx: 6, dy: 6, radius: 30, score: 16 },
    { x: -400, y: 220, dx: 7, dy: 6, radius: 30, score: 7 },
  ],
];

document.getElementById("Hscore").innerHTML = Hscore;

let bg = new IMAGE(
  "./assets/images/background.jpg",
  0,
  0,
  window.innerWidth,
  490
);

let brick = new IMAGE(
  "./assets/images/brick.jpg",
  0,
  490,
  window.innerWidth,
  window.innerHeight
);

let rock = new IMAGE("./assets/images/rocknew2.jpg", 100, 100, 60, 60);

// var bullet=new Circle(450,450,-2,2,35);
var object = [];

var pauseS = new Audio();
pauseS.src = "./assets/audios/pause.wav";

var dies = new Audio();
dies.src = "./assets/audios/dies.wav";

document.getElementById("play").addEventListener("click", function () {
  window.location.reload();
});

let KEYWORD;

function pauseGame(msg, msg1, msg2) {
  if (GAMING) {
    if (msg) {
      ctx.save();
      ctx.fillStyle = "rgb(0,0,0,0.6)";
      ctx.font = "italic normal 800 40px arial";
      ctx.textAlign = "center";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(255,255,255,1)";
      ctx.fillText(msg, canvas.width * 0.5, 270);
    }
    if (msg1) {
      ctx.font = "italic normal 400 30px arial";
      ctx.fillText(msg1, canvas.width * 0.5, 310);
    }
    if (msg2) {
      ctx.font = "italic normal 700 18px arial";
      ctx.fillText("~" + msg2, canvas.width * 0.805, 488);
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillText("A", canvas.width * 0.923, 488);
      ctx.font = "italic normal 700 30px arial";
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.fillText("S", canvas.width * 0.94, 488);
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.font = "italic normal 700 18px arial";
      ctx.fillText("TO", canvas.width * 0.96, 488);
    }

    ctx.restore();
    // clearInterval(stop);
    GAMING = false;

    if (msg == "PAUSED") pauseS.play();
    else if (msg == "GameOver:~(") gameover.play();
    else if (msg == "Congratualation For Completing The Game:~)")
      complete.play();

    BACKGROUNDS.pause();

    clearInterval(KEYWORD);
  } else {
    KEYWORD = setInterval(Pausing, 25);
    BACKGROUNDS.play();
    // stop = setInterval(repeat, 20);
    GAMING = true;
  }
}

window.addEventListener("keydown", function (event) {
  MOVEMENT = "STILL";
  KEY_IS_PRESSED_DOWN = true;

  if (event.keyCode == 32) {
    pauseGame("PAUSED");
  }
});

window.addEventListener("keydown", function (event) {
  MOVEMENT = "STILL";
  KEY_IS_PRESSED_DOWN = true;

  if (event.keyCode == 37 || event.keyCode == 65) {
    move = -8;
  }

  if (event.keyCode == 39 || event.keyCode == 68) {
    move = 8;
  }
});

window.addEventListener("keyup", function (event) {
  KEY_IS_PRESSED_DOWN = false;
  if (event.keyCode == 37 || (event.keyCode == 65 && move < 0)) {
    move = 0;
  }

  if (event.keyCode == 39 || (event.keyCode == 68 && move > 0)) {
    move = 0;
  }
});

function Pausing() {
  if (rate == compare) fire();
  else rate = rate + 10;
}

function Dist(A, B) {
  return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
}

function collisionC(c1, c2) {
  return Dist(c1, c2) <= c1.radius + c2.radius;
}

function collisionR(c1, r1) {
  if (
    c1.x - c1.radius <= r1.x + r1.w &&
    c1.x + c1.radius >= r1.x &&
    c1.y - c1.radius <= r1.y + r1.h &&
    c1.y + c1.radius >= r1.y
  )
    return true;
  else return false;
}
function collisionRR(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.y + rect1.h > rect2.y
  )
    return true;
  else return false;
}

function fire() {
  rate = 0;

  if (!GAMING) return;
  var gun = new Audio();
  gun.src = "./assets/audios/gun.mp3";
  gun.volume = "0.3";
  gun.play();

  let fireRate = 0;
  // oldTime = date.getTime;
  for (var j = 0; j < X.length; j++) {
    if (X[j].onScreen == true) {
      break;
    }
  }
  X.splice(0, j);

  var A = new IMAGE(
    "./assets/images/BULLET.jpg",
    shoot.x + shoot.w * 0.5 - 30 * (Math.random() - 0.5),
    shoot.y + 6 * (Math.random() - 0.5) - 15,
    8,
    30,
    Gati
  );
  var slow = 50;
  for (var i = 0; i < X.length; i++) {
    if (slow == 0) break;
    if (collisionRR(A, X[i])) {
      A = new IMAGE(
        "./assets/images/BULLET.jpg",
        shoot.x + shoot.w * 0.5 - 30 * (Math.random() - 0.5),
        shoot.y + 6 * (Math.random() - 0.5) - 15,
        8,
        30,
        Gati
      );
      slow--;
      i = -1;
    }
  }
  X.push(A);
}

function IMAGE(img, x, y, w, h, dy) {
  this.src = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  if (!dy) this.dy = 0;
  else this.dy = -dy;
  this.pic = new Image();
  this.onScreen = true;
  this.update = function () {
    if (X.length) {
      for (var i = 0; i < object.length; i++) {
        for (var j = 0; j < X.length; j++) {
          if (collisionR(object[i], X[j]) && !object[i].over) {
            if (object[i].score > 1) {
              X.splice(j, 1);

              object[i].score--;
              result++;

              if (result % 2 == 0 && compare > 10 && rate < compare) {
                compare -= 10;
              }

              rate + rate.toFixed(2);

              object[i].on = true;
              object[i].color =
                "rgb(" +
                Math.random() * 255 +
                "," +
                Math.random() * 255 +
                "," +
                Math.random() * 255 +
                ")";
            } else {
              if (object[i].score == 1) {
                result++;
              }

              // i=-1;
              if (object[i].radius > 6 && object[i].initial >= 2) {
                object.push(
                  new Circle(
                    object[i].x,
                    object[i].y,
                    object[i].dx,
                    object[i].dy,
                    object[i].radius * 0.5 + 1,
                    Math.round(object[i].initial * 0.5)
                  )
                );
                object.push(
                  new Circle(
                    object[i].x,
                    object[i].y,
                    -object[i].dx,
                    -object[i].dy,
                    object[i].radius * 0.5 + 1,
                    Math.round(object[i].initial * 0.5)
                  )
                );
              } else {
                var explode = new Audio();
                explode.src = "./assets/audios/explode.wav";
                explode.play();
                object.push(
                  new Circle(
                    object[i].x,
                    object[i].y,
                    object[i].dx,
                    object[i].dy,
                    2,
                    Math.round(object[i].initial * 0.5),
                    true
                  )
                );
                object.push(
                  new Circle(
                    object[i].x,
                    object[i].y,
                    -object[i].dx,
                    -object[i].dy,
                    2,
                    Math.round(object[i].initial * 0.5),
                    true
                  )
                );
              }
              object[i].src = "";
              object.splice(i, 1);
            }
          }
          // else{object[i].on=false;}
        }
      }
    }

    if (!X.length) {
      for (var i = 0; i < object.length; i++) {
        object[i].on = false;
      }
    }
    this.draw();
  };

  this.draw = function () {
    this.y += this.dy;
    if (this.y + this.h < 0) this.onScreen = false;

    this.pic.src = this.src;
    ctx.drawImage(this.pic, this.x, this.y, this.w, this.h);
  };
}

function Circle(x, y, dx, dy, r, score, over) {
  this.x = x;
  this.dx = dx;
  this.y = y;
  this.dy = dy;
  this.beating = false;
  this.counter = 0;
  this.on = false;
  if (this.x < 0 || this.x > canvas.width) this.start = true;

  if (!over) this.over = false;
  else this.over = true;

  if (!score) this.score = Math.round(Math.random() * 5) + 1;
  else this.score = score;

  this.initial = this.score;
  if (!over) this.radius = Math.min(Math.max(10, r + this.score), 45);
  else this.radius = 5;

  this.ini = this.radius;
  this.color =
    "rgb(" +
    Math.random() * 255 +
    "," +
    Math.random() * 255 +
    "," +
    Math.random() * 255 +
    ")";

  // helps to delete the bullets which are not in
  // the screen and hence maintain the speed of gameplay
  this.onScreen = true;

  this.cool = 0;
  this.increment = (Math.random() - 0.5) * 0.1;

  this.update = function () {
    if (this.x > 50 && this.dx > 0) this.start = false;

    if (this.x < canvas.width - 50 && this.dx < 0) this.start = false;

    if (!this.start) {
      if (!this.over) {
        if (collisionR(this, shoot)) {
          if (LIFE >= 2) {
            // this.x = 115;
            //     this.y = 115;
            Leveln--;
            LIFE--;
            rate = 0;
            dies.play();
            messenger();
          } else {
            LIFE = 0;
            if (result == +sessionStorage.getItem("HSCORE"))
              pauseGame("GameOver:~(", "Congo You've Made A New Score");
            else pauseGame("GameOver:~(", "Wanna Try Again...");

            document.getElementById("play").style.visibility = "visible";
          }
        }

        if (
          this.x - this.radius + this.dx <= 0 ||
          this.x + this.radius + this.dx >= canvas.width
        )
          this.dx = -1 * this.dx;
        if (this.y - this.radius + this.dy <= 0) this.dy = -1 * this.dy;
        if (this.y + this.radius + this.dy >= 490) this.dy = -1 * this.dy;
      } else {
        if (
          this.x - this.radius + this.dx <= 0 ||
          this.x + this.radius + this.dx >= canvas.width
        )
          this.dx = -0.01 * this.dx;
        if (this.y - this.radius + this.dy <= 0) this.dy = -0.03 * this.dy;
        if (this.y + this.radius + this.dy >= 490) this.dy = -0.03 * this.dy;

        this.x += this.dx;
        this.y += this.dy;
      }
    } else {
      this.x += this.dx;
    }

    this.draw();
  };

  this.draw = function () {
    if (!this.over && !this.start) {
      if (this.y + this.radius < 0) this.onScreen = false;

      this.x += this.dx;
      this.y += this.dy;

      // if(this.beating)
      // {this.counter--;
      // if(this.counter==0)
      // {
      // this.radius=this.radius+10;
      // }
      // else this.radius=50;
      // }
      ctx.font = "bold 18px Arial";

      if (this.on) {
        if (this.counter == 25) {
          if (!this.beating) {
            this.radius -= 5;
            this.beating = true;
            this.counter = 0;
            ctx.font = "bold 18px Arial";
          } else {
            this.radius += 5;
            this.beating = false;
            this.counter = 0;
            ctx.font = "bold 24px Arial";
          }
        }
        this.counter++;
      }
    }
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    if (!this.over) {
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.cool);
      this.cool += this.increment;
      ctx.fillText(this.score, 0, 5);
      ctx.restore();
    }
    ctx.restore();
  };
}

function Shooter(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.dx = move;
  this.w = w;
  this.h = h;
  this.color = "blue";

  this.update = function () {
    this.dx = move;
    if (this.x + this.dx < 0 || this.x + this.w + this.dx > canvas.width) {
      this.dx = 0;
      move = 0;
    }
    this.x += this.dx;
    this.draw();
  };

  this.draw = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.stroke();
    ctx.closePath();
  };
}

function messenger() {
  Upgrade();
  pauseGame(message[Leveln].msg, message[Leveln].msg1);
}

function Upgrade() {
  Leveln++;

  if (Leveln == 3) {
    if (result == +sessionStorage.getItem("HSCORE"))
      pauseGame(
        "Congratualation For Completing The Game:~)",
        "Congo You've Made A New Score"
      );
    else
      pauseGame(
        "Congratualation For Completing The Game:~)",
        "Wanna Play Again"
      );

    document.getElementById("play").style.visibility = "visible";
  } else {
    object.splice(0);
    for (var j = 0; j < LEVEL[Leveln].length; j++) {
      object.push(
        new Circle(
          LEVEL[Leveln][j].x,
          LEVEL[Leveln][j].y,
          LEVEL[Leveln][j].dx,
          LEVEL[Leveln][j].dy,
          LEVEL[Leveln][j].radius,
          LEVEL[Leveln][j].score
        )
      );
    }

    if (onetime[Leveln]) {
      chapter[Leveln].play();
      onetime[Leveln] = false;
    }

    if (Leveln == 1) bg.src = "./assets/images/beach.jpg";
    else if (Leveln == 2) bg.src = "./assets/images/forest.png";

    setTimeout(pauseGame, 2500);
  }
}

var shoot = new Shooter(canvas.width * 0.5 - 40, 470, 80, 20);

function calculateDirection() {
  let maxProb = MOVEMENT_PROBABILITY[1];
  let direction = "STILL";

  if (MOVEMENT_PROBABILITY[0] > maxProb) {
    maxProb = MOVEMENT_PROBABILITY[0];
    direction = "LEFT";
  }

  if (MOVEMENT_PROBABILITY[2] > maxProb) {
    maxProb = MOVEMENT_PROBABILITY[2];
    direction = "RIGHT";
  }
  if (!KEY_IS_PRESSED_DOWN && direction == "LEFT") move = -8;
  else if (!KEY_IS_PRESSED_DOWN && direction == "RIGHT") move = 8;
  else if (!KEY_IS_PRESSED_DOWN && direction == "STILL") move = 0;
}

function repeat() {
  calculateDirection();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  bg.draw();
  brick.draw();

  shoot.update();
  if (done == 2)
    pauseGame("START", "Enter Space To Begin", "Brought To You By");

  done++;

  for (var j = 0; j < X.length; j++) {
    X[j].update();
  }

  var k = 0;
  for (var j = 0; j < object.length; j++) {
    object[j].update();
    if (object[j].over) k++;
  }

  if (k == object.length && done > 1) {
    messenger();
  }

  document.getElementById("score").innerHTML = result;
  document.getElementById("life").innerHTML = LIFE;

  if (result > Hscore) {
    document.getElementById("Hscore").innerHTML = result;
    sessionStorage.setItem("HSCORE", result);
  }
}

// stop = setInterval(repeat, 20);

module.exports.repeatGameState = () => {
  if (GAMING) repeat();
};

module.exports.setClassesProbability = (probability) => {
  MOVEMENT_PROBABILITY[0] = probability[0];
  MOVEMENT_PROBABILITY[1] = probability[1];
  MOVEMENT_PROBABILITY[2] = probability[2];
};
