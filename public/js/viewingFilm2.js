
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




        for (var id in remotePlayers)
        {

            if (remotePlayers[id].alive)
                //could this be done asyncronously?
                remotePlayers[id].update();

        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        this.game.physics.arcade.overlap(this.player, this.signs, this.touchSign, null, this);
        removeSign(lastOverlapped);

         playerMovementAndAnimation.call(this, socket, clientRoom);
    }
};

