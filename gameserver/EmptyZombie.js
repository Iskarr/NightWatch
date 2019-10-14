// Zombie init
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

// Move to Player
if (myGamePiece.x > zom.x) {
  zom.x = zom.x + zom.speed;
}
if (myGamePiece.y > zom.y) {
  zom.y = zom.y + zom.speed;
}
if (myGamePiece.x < zom.x) {
  zom.x = zom.x - zom.speed;
}
if (myGamePiece.y < zom.y) {
  zom.y = zom.y - zom.speed;
}

// Draw the Zombie
ctx.beginPath();
ctx.save();
ctx.translate(zom.x, zom.y);
zomAngle = getZomAngle(zom.x, zom.y);
if (deltaX < 0) {
  ctx.rotate(zomAngle);
} else {
  ctx.rotate(zomAngle);
  ctx.scale(-1, 1);
}
ctx.translate(-zom.x, -zom.y);
ctx.fillStyle = zom.fill;
ctx.moveTo(zom.x - 15, zom.y);
ctx.lineTo(zom.x + 15, zom.y + 10);
ctx.lineTo(zom.x + 15, zom.y - 10);
ctx.lineTo(zom.x - 15, zom.y);
ctx.fill();
ctx.restore();
ctx.closePath();
