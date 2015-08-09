
artGame.viewing2 = function(){};


artGame.viewing2.prototype = {
    preload: getPlayers,

    create: function(){
        //remotePlayers = {};
        $('#horse-video').hide();
        $('#tek-video').hide();

        $('#tek-video').prop('muted', true);
        socket.emit('join room', {room:'viewing2', id: clientId});
        setUpChat.call(this,socket);

        if(music) music.resume();

        this.facing = "left";
        this.level = 'viewing2';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#ffffff';
        this.map = this.game.add.tilemap('viewing2');
        this.map.addTilesetImage('viewing2');
        this.layer = this.map.createLayer('Tile Layer 1');
        //  Un-comment this on to see the collision tiles
       // this.layer.debug = true;

        this.map.setCollisionBetween(1712, 1718);
        this.map.setCollisionBetween(1504, 1545);
        this.map.setCollision([1851, 1852, 1802, 1752, 1703, 1653, 1604, 1554,1546, 1596, 1646, 1647, 1697, 1747, 1748, 1749, 1798, 1799, 1849, 1848, 1899]);



        this.player = this.game.add.sprite(32, 32, 'dude');
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        this.player.body.drag.set(0.2);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(5, 32, 5, 16);
        
        if(artGame.lastRoom == 'viewing1'){
          this.player.position.x = 398;
          this.player.position.y = 504;
        }

        else if(artGame.lastRoom == 'viewing3'){
          this.player.position.x = 695;
          this.player.position.y = 520;
        }
        else if(artGame.lastRoom == 'viewingHorse'){
          this.player.position.x = 60;
          this.player.position.y = 520;
        }
        else if(artGame.lastRoom == 'viewingFilm2'){
          this.player.position.x = 170;
          this.player.position.y = 494;
        }
        clientRoom = 'viewing2';



        this.player.animations.add('left', [0, 1, 2, 3,4,5,6,7], 5, true);
        this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 5, true);
        this.player.animations.add('idleRight', [8], 5, true);
        this.player.animations.add('idleLeft', [0], 5, true);


        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

         // Start listening for events
        initializeRemotePlayers('viewing2');
        createDoors.call(this);
        createSigns.call(this);
        setEventHandlers.bind(this)();


    },
  touchSign: function(player, sign) {
    lastOverlapped = game.time.now + 100;
    showSign('Untitled', '', 'Charlie Freedman');
  },
  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewing2', id: clientId});
    artGame.lastRoom = 'viewing2';
     $('form').off('submit');
    
    if(door.targetTilemap==='viewingHorse'){
        clientRoom = 'viewingHorse';
        this.state.start('viewingHorse');

    }
    if(door.targetTilemap==='viewing3'){
        clientRoom = 'viewing3';
        this.state.start('viewing3');

    }

    if(door.targetTilemap==='viewingFilm2'){
        clientRoom = 'viewingFilm2';
        this.state.start('viewingFilm2');

    }
    if(door.targetTilemap==='viewing1'){
        clientRoom = 'viewing1';
        this.state.start('viewing1');
    }


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

