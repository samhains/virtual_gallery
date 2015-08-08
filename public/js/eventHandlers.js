var setEventHandlers = function() {

    socket.on("connect", onSocketConnected.bind(socket));
    socket.on("disconnect", onSocketDisconnect.bind(this));
    socket.on("new player", onNewPlayer.bind(this));
    socket.on("move player", onMovePlayer.bind(this));
    socket.on("remove player", onRemovePlayer.bind(this));
    socket.on("leave room", leaveRoom.bind(socket));
    socket.on("join room", joinRoom.bind(this));
};


function onSocketConnected() {
    clientId = socket.id;
    socket.emit('join room', {room:this.nsp.slice(1), id: clientId});
}

function leaveRoom(data){
    
    console.log('remote players', remotePlayers);
    console.log('client id', data.id);

    if(remotePlayers[data.id]){
        remotePlayers[data.id].destroy();
        delete remotePlayers[data.id];

    }
    else{
      console.log("error with removing player", data.id, remotePlayers);
    }

}

function joinRoom(data){


  console.log('we are joining room with', data);

    var players = data.players;
    data = data.data;
    //if the player joining is joining the same room that the client is in
    if(clientRoom === data.room){
        //add newly joined player to clients remote array
        if(remotePlayers[data.id]){
            remotePlayers[data.id].destroy();
        }

        var joiningPlayer = new RemotePlayer(data.id,this.game, players[data.id].x,players[data.id].y);
        remotePlayers[data.id] = joiningPlayer;
    }

}

function onSocketDisconnect() {
  console.log('disconnecting!');
}

function onNewPlayer(data) {
    if(clientRoom === data.room){
        if(remotePlayers[data.id]){
            remotePlayers[data.id].destroy();
            delete remotePlayers[data.id];
        }
        remotePlayers[data.id] = new RemotePlayer(data.id,this.game,data.x,data.y);
      }

};

function onMovePlayer(data) {
    var movePlayer;
    movePlayer = remotePlayers[data.id];
    if(clientRoom === data.room){
         if (!movePlayer) {
            return;
    }
    if(movePlayer.lastPosition.x> data.x){
        movePlayer.facing = 'left';
        movePlayer.animations.play('left');
    }
    else if(movePlayer.lastPosition.x<data.x){
        movePlayer.facing = 'right';
        movePlayer.animations.play('right');

    }
    if(movePlayer.lastPosition.y !== data.y){
        if(movePlayer.facing ==='left')
            movePlayer.animations.play('left');
        else
            movePlayer.animations.play('right');
    }

    movePlayer.lastMoveTime = this.game.time.now;
    movePlayer.position.x = data.x;
    movePlayer.position.y = data.y;


    }

}

function onRemovePlayer(data) {


    var remotePlayer = remotePlayers[data.id];
    if(remotePlayer){
        remotePlayer.destroy();
        delete remotePlayers[data.id];

    }




}
