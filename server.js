var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;
var socket,
    players;




app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});


function init() {
	players = [];
	setEventHandlers();

}

var setEventHandlers = function() {
    io.on("connection", onSocketConnection);
};

function onSocketConnection(socket) {
    console.log("New player has connected: "+socket.id);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    //socket.on("remove player", onRemovePlayer);
}
function onSocketDisconnect() {

    console.log("on socket Player has disconnected: "+this.id);
    //onRemovePlayer();
    //this.emit("remove player", {id: this.id});
    var removePlayer = playerById(this.id);

	if (!removePlayer) {
	    console.log(" on socket Player not found: "+this.id);
	    return;
	}

	players.splice(players.indexOf(removePlayer), 1);
	//?
	this.broadcast.emit("remove player", {id: this.id});

}

function onNewPlayer(data) {

	var newPlayer = new Player(data.x,data.y);
	newPlayer.id = this.id;
	//broadcast to all the open sockets/clients
	this.broadcast.emit("new player",
		{id: newPlayer.id, x: newPlayer.getX(),
			y: newPlayer.getY()});

	//to this particular socket, update the existing player information
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
	    existingPlayer = players[i];
	    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	}
	players.push(newPlayer);


}

function onMovePlayer(socket) {
	var movePlayer = playerById(this.id);
	//console.log("move player ID", this.id);

	if (!movePlayer) {
	    console.log("move Player not found: "+this.id);
	    return;
	}

	movePlayer.setX(socket.x);
	movePlayer.setY(socket.y);

	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});

}

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};

init();

