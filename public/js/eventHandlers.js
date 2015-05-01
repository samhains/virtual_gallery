var setEventHandlers = function() {

    socket.on("connect", onSocketConnected.bind(this));
    socket.on("disconnect", onSocketDisconnect.bind(this));
    socket.on("new player", onNewPlayer.bind(this));
    socket.on("move player", onMovePlayer.bind(this));
    socket.on("remove player", onRemovePlayer.bind(this));
    socket.on("leave room", leaveRoom.bind(this));
    socket.on("join room", joinRoom.bind(this));
};


function onSocketConnected() {
    console.log("Connected to socket server");
    this.player.id = socket.id;

}

function leaveRoom(data){
    console.log('leave room data', data,this.player.id);

    if(remotePlayers[data.id]){
        remotePlayers[data.id].destroy();
        delete remotePlayers[data.id];

    }
    



}

function joinRoom(data){

    console.log("this player", data.data.id, "is joining",data.data.room);
    console.log('join data',data);
    console.log("YOU ARE THIS.PLAYER",this.player.id, "and you are IN", this.player.room);


    var players = data.players;
    data = data.data;
    //if the player joining is joining the same room that the client is in
    if(this.player.room === data.room){
        //add newly joined player to clients remote array
        if(remotePlayers[data.id]){
            remotePlayers[data.id].destroy();
        }

        var joiningPlayer = new RemotePlayer(data.id,this.game, players[data.id].x,players[data.id].y);
       // console.log('adding new joining player',joiningPlayer.id, data.room);
        remotePlayers[data.id] = joiningPlayer;
    }

}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    //debugger;
    console.log("New player connected: "+data.id, data.room);
    if(this.player.room === data.room){
        if(remotePlayers[data.id]){
            console.log('destroying remotePlayer that already exists');
            remotePlayers[data.id].destroy();
            delete remotePlayers[data.id];
        }
        remotePlayers[data.id] = new RemotePlayer(data.id,this.game,data.x,data.y);
        }

};

function onMovePlayer(data) {
    var movePlayer;
    //console.log('move play',this.player);
   // console.log('data',data,this.player.room);
    movePlayer = remotePlayers[data.id];
    if(this.player.room === data.room){
         if (!movePlayer) {
            console.log("Move Player not found: "+data.id);
            return;
    }

    movePlayer.position.x = data.x;
    movePlayer.position.y = data.y;


    }

};

function onRemovePlayer(data) {


    var remotePlayer = remotePlayers[data.id];
    if(remotePlayer){
        remotePlayer.destroy();
        delete remotePlayers[data.id];

    }




};