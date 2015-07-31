var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;
var socket,
    players;
var models = require('./models');
var Message = models.Message;
var mongoose = require('mongoose');
var swig = require('swig');

//set up swig as render engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/getPlayers',function(req,res,next){
	res.send(players);
});

app.get('/', require('./routes'));



http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});


function init() {
	players = {};
	setEventHandlers();
}

var setEventHandlers = function() {
	var entrance = io.of('/entrance');
	entrance.on('connection', onSocketConnection);
	var viewing1 = io.of('/viewing1');
	viewing1.on('connection',onSocketConnection);
	var viewing2 = io.of('/viewing2');
	viewing2.on('connection',onSocketConnection);
	var viewingHorse = io.of('/viewingHorse');
	viewingHorse.on('connection',onSocketConnection);
};

function onSocketConnection(socket) {
    console.log("New player has connected: "+socket.id);
    socket.emit('connected',socket.id);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer.bind(socket));
    socket.on('chat message', chatMessage.bind(socket));
    socket.on("remove player", onRemovePlayer.bind(socket));
    socket.on('join room', joinRoom.bind(socket));
    socket.on('leave room', leaveRoom.bind(socket));
}


function chatMessage(data){	
	this.broadcast.emit('chat message', data);
  		
}

function joinRoom(data){
	console.log('joining with ', data);
	var obj = {data: data, players: players};


	var joinPlayer = players[this.id];
	//first set the server room information
	if(joinPlayer){
		joinPlayer.room = data.room;
		//then transmit the join room message to everyone with data necessary
		//for remote player update

		this.broadcast.emit('join room', obj);
		//this.join(data.room);

	}
	else{
		console.error('join player doesnt exist',data);
	}
	
}
function leaveRoom(data){
	this.broadcast.emit('leave room', data);
	//this.emit('leave room');
	//this.leave(data.room)
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

	this.broadcast.emit("remove player", {id: removePlayer.id, room: removePlayer.room});

}

function  onRemovePlayer(data){

	this.broadcast.emit("remove player", {id: data.id, room: data.room});

}


function onNewPlayer(data) {
	//if the player doesnt already exist, and there is a valid ID
	if(!players[this.id] && this.id){
		var newPlayer = new Player(data.x,data.y);
		newPlayer.id = this.id;
		//broadcast to all the open sockets/clients
		//adding a new player for everyone else
		this.broadcast.emit("new player",
			{id: newPlayer.id, x: newPlayer.x,
				y: newPlayer.y, room: 'entrance'});

		//to this particular socket, update the existing player information
		//this could probably be optimized as we only need to broadcast new player
		var i, existingPlayer;
		for (var player in players) {
		    existingPlayer = players[player];
		    if(data.room === players[player].room)
		    	this.emit("new player", {id: existingPlayer.id, x: existingPlayer.x, y: existingPlayer.y, room:players[player].room});
		}
		players[this.id] = newPlayer;



	}
	


}

function onMovePlayer(socket) {

	var movePlayer = players[this.id];
	//console.log(movePlayer);

	if (!movePlayer) {
	    console.log("move Player not found: "+this.id);
	    return;
	}
	movePlayer.x = socket.x;
	movePlayer.y = socket.y;
	movePlayer.room = socket.room;
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y, room:movePlayer.room});

}



init();

