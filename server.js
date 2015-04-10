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
	players = {};
	setEventHandlers();


}

var setEventHandlers = function() {
    io.on("connection", onSocketConnection);
};

function onSocketConnection(socket) {
    console.log("New player has connected: "+socket.id);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer.bind(socket));
    socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});
    //socket.on("remove player", onRemovePlayer);
}
function onSocketDisconnect() {

    console.log("on socket Player has disconnected: "+this.id);
    //onRemovePlayer();
    //this.emit("remove player", {id: this.id});
    var removePlayer = players[this.id];

	if (!removePlayer) {
	    console.log(" on socket Player not found: "+this.id);
	    return;
	}

	delete players[this.id];
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
	for (var player in players) {
	    existingPlayer = players[player];
	    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	}
	players[this.id] = newPlayer;


}

function onMovePlayer(socket) {

	var movePlayer = players[this.id];


	if (!movePlayer) {
	    console.log("move Player not found: "+this.id);
	    return;
	}

	movePlayer.setX(socket.x);
	movePlayer.setY(socket.y);

	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});

}



init();

