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

    if(this.level ==='lobby'){
         socket.emit("new player", {x: this.player.x, y: this.player.y});
    }


};
function leaveRoom(data){
    if(data.room ==='lobby'){
        remotePlayer = lobbyPlayers[data.id];
        remotePlayer.destroy();

    }


}

function joinRoom(data){

    var players = data.players;
    console.log(players);
    data = data.data;
    if(data.room ==='viewing1'){
        leavingPlayer = lobbyPlayers[data.id];
        var joiningPlayer = new RemotePlayer(data.id,this.game, data.x,data.y);
        viewingPlayers[data.id] = joiningPlayer;


    }


}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    lobbyPlayers[data.id] = new RemotePlayer(data.id,this.game,data.x,data.y);
};

function onMovePlayer(data) {
    var movePlayer;


   
    if(data.room ==='lobby'){
        movePlayer = lobbyPlayers[data.id];

    }
    if(data.room ==='viewing1'){
        movePlayer = viewingPlayers[data.id];

    }
     if (!movePlayer) {
        console.log("Move Player not found: "+data.id);
        return;
    }

    movePlayer.position.x = data.x;
    movePlayer.position.y = data.y;

};

function onRemovePlayer(data) {

     if(data.room ==='lobby'){
        remotePlayer = lobbyPlayers[data.id];
        if(remotePlayer){
            remotePlayer.destroy();
            delete lobbyPlayers[data.id];

        }
       

    }
    if(data.room ==='viewing1'){
        removePlayer = viewingPlayers[data.id];
        delete viewingPlayers[data.id];

    }



};