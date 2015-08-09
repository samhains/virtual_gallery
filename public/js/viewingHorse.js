
artGame.viewingHorse = function(){};


artGame.viewingHorse.prototype = {
    preload: getPlayers, 

    create: function(){
        //remotePlayers = {};

        createFilmLevel.call(this, 'viewingHorse', 'horse-video', false);


    },

  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewingHorse', id: socket.id});
    artGame.lastRoom = 'viewingHorse';
    socket.emit('join room', {room:'viewing2', id: socket.id});
    clientRoom = 'viewing2';
    this.state.start('viewing2');



  },

  touchSign: function(player, sign) {
    lastOverlapped = game.time.now + 100;
    showSign('Untitled (Central Park)', '', 'Harry Hughes');
  },

    update: function(){

        updateRemotePlayers(remotePlayers);
        collisionSetUp.call(this, true);
        removeSign(lastOverlapped);
        playerMovementAndAnimation.call(this, socket, clientRoom);
    }
};

