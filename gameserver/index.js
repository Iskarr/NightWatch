const io = require("socket.io")();
const port = process.env.PORT || 3000;

var whosit;
//var gamepieces = {};
var taggable = true;
var clearTaggable;
var floor = { x: 600, y: 50, color: "#ff0000" };
var zombie = { x: 0, y: 0, color: "" };

function onConnection(socket) {
  //console.log('Connection received: ' + socket.request.connection.remoteAddress + ":" + socket.request.connection.remotePort);
  socket.broadcast.emit("announce", {});
  if (whosit) {
    socket.emit("it", { uuid: whosit });
  }

  io.emit("bigfloor", floor);

  io.emit("zombie", zombie);

  socket.on("move", data => {
    socket.broadcast.emit("moved", data);
    socket.userid = data.uuid;
    // determine who's it
    if (!whosit) {
      whosit = data.uuid;
      io.emit("it", { uuid: whosit });
      //socket.broadcast.emit('it', { "uuid": whosit } )
    }
    // console.log("move received: ");
    // console.log(data);
    socket.broadcast.emit("bigfloor", floor);
    socket.broadcast.emit("zombie", zombie);
  });

  socket.on("tagged", data => {
    if (data.olduuid && data.newuuid && getTaggable()) {
      setTaggable(false);
      whosit = data.newuuid;
      io.emit("it", { uuid: data.newuuid });
      setTimeout(function() {
        setTaggable(true);
      }, 3000);
    }
  });

  socket.on("disconnect", () => {
    if (whosit == socket.userid) {
      whosit = undefined;
    }
    socket.broadcast.emit("remove", { uuid: socket.userid });
  });
}

function getTaggable() {
  return taggable;
}
function setTaggable(value) {
  if (value != undefined) {
    taggable = value;
  } else {
    taggable = true;
  }
  //console.log('Taggable: ' + taggable);
}

io.on("connection", onConnection);

io.listen(port);
console.log("listening on port ", port);
