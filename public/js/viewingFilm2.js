
artGame.viewingFilm2 = function(){};


artGame.viewingFilm2.prototype = {
    preload: getPlayers, 

    create: function(){
      createFilmLevel.call(this, 'viewingFilm2', 'tek-video', true);

    },
  touchSign: function(player, sign) {
    lastOverlapped = game.time.now + 100;
    showSign('Tek Yon Vol 3.', '', 'Charlie Freedman');
  },
  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewingFilm2', id: clientId});
    artGame.lastRoom = 'viewingFilm2';
    clientRoom = 'viewing2';
    this.state.start('viewing2');

  },
    update: function(){


        updateRemotePlayers(remotePlayers);
        collisionSetUp.call(this, true);
        removeSign(lastOverlapped);

        playerMovementAndAnimation.call(this, socket, clientRoom);
    }
};

