$(function() {
  init();
});

function init() {
  console.log("start");

  // define variables
  var canvas, c;

  var INTERVAL = 20;
  var mouseX, mouseY;
  var mousePos;
  var keys = [];
  var xdetect, ydetect;
  var playerBullets = [];

  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  // set up canvas
  canvas = document.getElementById("canvas");
  c = canvas.getContext("2d");

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  // initial canvas background
  c.beginPath();
  c.fillStyle = "rgb(45,133,222)";
  c.rect(0, 0, 800, 600);
  c.fill();
  c.closePath();

  // Player coords and initial location
  function Player() {
    this.x = 400;
    this.y = 300;
    this.w = 10;
    this.h = 10;
    this.tired = false;
    this.speed = 4;
    this.energy = 150;
    this.health = 150;
    this.recovery = 0;
    this.xcenter = 400;
    this.ycenter = 300;
    this.angle = 0.9;
    this.fill = "#000000";
  }
  var Player1 = new Player();

  // inital zombie
  function Zombie() {
    this.x = 200;
    this.y = 200;
    this.w = 10;
    this.h = 10;
    this.direction = 0.5;
    this.speed = 4;
    this.health = 100;
    this.angle = 1;
    this.fill = "red";
  }
  var zom = new Zombie();

  // get the angle between the zombie and the player
  function getZomAngle(zomx, zomy) {
    deltaX = Player1.x - zomx;
    deltaY = Player1.y - zomy;
    return Math.atan(deltaY / deltaX);
  }

  // game loop interval //

  setInterval(mainDraw, INTERVAL);

  // clear canvas function
  function clear(c) {
    c.clearRect(0, 0, WIDTH, HEIGHT);
  }

  // collision dectection routine
  function collides(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }

  // get bullet angle
  function getBulletAngle() {
    deltaX = mouseX - Player1.x;
    deltaY = mouseY - Player1.y;
    return Math.atan(deltaY / deltaX);
  }

  // Create bullet
  function createBullet() {
    var bullet = new Bullet();
    playerBullets.push(bullet);
  }

  // constructor to create bullets
  function Bullet() {
    this.active = true;
    this.x = Player1.x;
    this.y = Player1.y;
    this.xVelocity = 2;
    this.yVelocity = 2;
    this.xtarget = mouseX;
    this.ytarget = mouseY;
    this.w = 2;
    this.h = 2;
    this.color = "#000";
    this.angle = getBulletAngle();

    this.bulletUpdate = function() {
      this.x += this.xVelocity;
      this.y += this.yVelocity;
    };

    this.bulletDraw = function() {
      c.beginPath();
      c.save();
      c.translate(this.x, this.y);
      if (deltaX < 0) {
        c.rotate(this.angle);
      } else {
        c.rotate(this.angle);
        c.scale(-1, 1);
      }
      c.translate(-this.x, -this.y);
      c.fillStyle = "#000000";
      c.rect(this.x, this.y, 2, 2);
      c.fill();
      c.restore();
      c.closePath();
    };
  } // bullet

  bulletCheckbounds = function() {
    return this.x >= 0 && this.x <= WIDTH && this.y >= 0 && this.y <= HEIGHT;
  };

  ///////////////////////////
  /////////////////////////////
  // drawing function / game loop
  function mainDraw(canvas, message) {
    ////////////////////////
    ////////////////////////
    ////////////////////////

    // move the player
    playerMove();

    // get the angle between the player coords and the mouse coords
    deltaX = mouseX - Player1.x;
    deltaY = mouseY - Player1.y;
    var newAngle = Math.atan(deltaY / deltaX);

    // clear the canvas and draw the background again
    clear(c);
    c.beginPath();
    c.fillStyle = "rgb(45,133,22)";
    c.strokeStyle = "black";
    c.rect(0, 0, 800, 600);
    c.fill();
    c.stroke();
    c.closePath();

    // draw the HUD with life, energy etc

    // stamina bar
    c.font = "18pt Calibri";
    c.fillStyle = "black";
    c.strokeStyle = "black";
    c.fillText("Stamina:", 10, 25);

    if (Player1.energy > 0) {
      c.beginPath();
      c.moveTo(105, 20);
      c.lineTo(105 + Player1.energy, 20);
      c.lineWidth = 10;
      if (Player1.energy < 50) {
        c.strokeStyle = "red";
      }
      c.stroke();
    } else {
      c.strokeStyle = "red";
      c.fillStyle = "red";
      c.lineWidth = 10;
      c.font = "bold 18pt Calibri";
      c.fillText("TIRED", 110, 25);
    }

    // health bar
    c.font = "18pt Calibri";
    c.fillStyle = "black";
    c.strokeStyle = "black";
    c.fillText("Health:", 280, 25);

    if (Player1.health > 0) {
      c.beginPath();
      c.moveTo(360, 20);
      c.lineTo(360 + Player1.health, 20);
      c.lineWidth = 10;
      if (Player1.health < 50) {
        c.strokeStyle = "red";
      }
      c.stroke();
    } else {
      c.strokeStyle = "red";
      c.fillStyle = "red";
      c.lineWidth = 10;
      c.font = "bold 18pt Calibri";
      c.fillText("DEAD", 410, 25);
    }

    // draw the player with the new angle so that it faces the mouse
    c.beginPath();
    c.save();
    c.translate(Player1.x, Player1.y);
    if (deltaX < 0) {
      c.rotate(newAngle);
    } else {
      c.rotate(newAngle);
      c.scale(-1, 1);
    }
    c.translate(-Player1.x, -Player1.y);
    c.fillStyle = "#000000";
    c.moveTo(Player1.x - 15, Player1.y);
    c.lineTo(Player1.x + 15, Player1.y + 10);
    c.lineTo(Player1.x + 15, Player1.y - 10);
    c.lineTo(Player1.x - 15, Player1.y);
    c.fill();
    c.restore();
    c.closePath();

    // draw zombies

    if (Player1.x > zom.x) {
      zom.x = zom.x + zom.speed;
    }
    if (Player1.y > zom.y) {
      zom.y = zom.y + zom.speed;
    }
    if (Player1.x < zom.x) {
      zom.x = zom.x - zom.speed;
    }
    if (Player1.y < zom.y) {
      zom.y = zom.y - zom.speed;
    }

    c.beginPath();
    c.save();
    c.translate(zom.x, zom.y);
    zomAngle = getZomAngle(zom.x, zom.y);
    if (deltaX < 0) {
      c.rotate(zomAngle);
    } else {
      c.rotate(zomAngle);
      c.scale(-1, 1);
    }
    c.translate(-zom.x, -zom.y);
    c.fillStyle = zom.fill;
    c.moveTo(zom.x - 15, zom.y);
    c.lineTo(zom.x + 15, zom.y + 10);
    c.lineTo(zom.x + 15, zom.y - 10);
    c.lineTo(zom.x - 15, zom.y);
    c.fill();
    c.restore();
    c.closePath();

    playerBullets.forEach(function(bullet) {
      if (
        bullet.x > WIDTH ||
        bullet.x < 0 ||
        bullet.y > HEIGHT ||
        bullet.y < 0
      ) {
        bullet.active = false;
      }
      playerBullets = playerBullets.filter(function(bullet) {
        return bullet.active;
      });

      bullet.bulletUpdate();
      bullet.bulletDraw();
    });

    // collision detection
    if (collides(Player1, zom)) {
      Player1.health = Player1.health - 1;
    }

    //console.log(playerBullets);

    for (var i in playerBullets) {
      if (i.x > WIDTH || i.x < 0 || i.y > HEIGHT || i.y < 0) {
        delete playerBullets[i];
      }
    }

    //console.log (playerBullets);
  } // mainDraw
  ///////////////////////////////
  ////////////////////////////
  /////////////////////////

  // focus on the canvas on mouseover to detect key input
  var handlefocus = function(e) {
    if (e.type == "mouseover") {
      canvas.focus();
      return false;
    } else if (e.type == "mouseout") {
      canvas.blur();
      return false;
    }
    return true;
  };
  canvas.addEventListener("mouseover", handlefocus, true);

  // Detect mouse movement and assign to mouseX, mouseY
  function mouseMove(e) {
    if (e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    } else if (e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
    }
  }
  canvas.addEventListener("mousemove", mouseMove, true);

  // Detect key press for movement
  function playerMove() {
    if (keys[16] & (Player1.energy > 0)) {
      // if shift down
      Player1.speed = 7;
      Player1.energy -= 1;
    }

    if (keys[16] & (Player1.energy < 1)) {
      Player1.speed = 4;
      if (Player1.energy > -150) {
        Player1.energy -= 1;
      }
    }

    if (!keys[16]) {
      Player1.speed = 4;
      if (Player1.energy < 150) {
        Player1.energy += 1;
      }
    }

    if (keys[87]) {
      Player1.y = Player1.y - Player1.speed;
    }

    if (keys[83]) {
      Player1.y += Player1.speed;
    }

    if (keys[65]) {
      Player1.x -= Player1.speed;
    }

    if (keys[68]) {
      Player1.x += Player1.speed;
    }

    return false;
  }

  canvas.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
  });
  canvas.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
  });

  canvas.addEventListener("click", createBullet);
}
