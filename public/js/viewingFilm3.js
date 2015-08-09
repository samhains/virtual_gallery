
artGame.viewingFilm3 = function(){};


artGame.viewingFilm3.prototype = {
    preload: getPlayers, 

    create: function(){
        //remotePlayers = {};

        createFilmLevel.call(this, 'viewingFilm3', 'kill-video', true);

    },
  touchSign: function(player, sign) {
    lastOverlapped = game.time.now + 100;
    showSign("i'll kill u sam hains ", '', 'Charlie Freedman');
  },

  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewingFilm3', id: socket.id});
    artGame.lastRoom = 'viewingFilm3';
    clientRoom = 'viewing3';
    this.state.start('viewing3');


  },

    update: function(){


        updateRemotePlayers(remotePlayers);
        collisionSetUp.call(this, true);
        removeSign(lastOverlapped);
        playerMovementAndAnimation.call(this, socket, clientRoom);
    }
};

