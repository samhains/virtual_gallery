var setEventHandlers = function() {

    socket.on("connect", onSocketConnected.bind(this));
    socket.on("disconnect", onSocketDisconnect.bind(this));
    socket.on("new player", onNewPlayer.bind(this));
    socket.on("move player", onMovePlayer.bind(this));
    socket.on("remove player", onRemovePlayer.bind(this));
};


function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {x: this.player.x, y: this.player.y});


};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    remotePlayers[data.id] = new RemotePlayer(data.id,this.game,this.player,data.x,data.y);

};

function onMovePlayer(data) {
    var movePlayer = remotePlayers[data.id];

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;

};

function onRemovePlayer(data) {
    var removePlayer = remotePlayers[data.id];

    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    delete remotePlayers[data.id];

};