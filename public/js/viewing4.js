var lastOverlapped;

artGame.viewing4 = function(){};


artGame.viewing4.prototype = {
    preload: getPlayers, 
    create: function(){


        $('.viewing3-imgs').hide();
        $('.viewing5-imgs').hide();
        $('.viewing4-imgs').show();
        socket.emit('join room', {room:'viewing4', id: clientId});
        setUpChat.call(this,socket);

        this.facing = "left";
        this.level = 'viewing4';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#ffffff';
        this.map = this.game.add.tilemap('viewing4');
        this.map.addTilesetImage('viewing4');
        this.layer = this.map.createLayer('Tile Layer 1');

        if(music) music.resume();

        if(music && !music.isPlaying){
                music.play('', 0,1,true);
         }

        this.map.setCollisionBetween(1504, 1545);
        this.map.setCollision([1851, 1852, 1802, 1752, 1703, 1653, 1604, 1554,  1649, 1699, 1546, 1596, 1647, 1697, 1748, 1749, 1799, 1849, 1900]);



        //this.layer.debug = true;
        //this.layer.resizeWorld();

        this.player = this.game.add.sprite(32, 32, 'dude');
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        this.player.body.drag.set(0.2);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(5, 32, 5, 16);
        this.player.position.x = 60;
        this.player.position.y = 520;

        if(artGame.lastRoom == 'viewing3'){
          this.player.position.x = 60;
          this.player.position.y = 520;
        }

        else if(artGame.lastRoom == 'viewing5'){
          this.player.position.x = 530;
          this.player.position.y = 508;
        }
        clientRoom = 'viewing4';


        this.player.animations.add('left', [0, 1, 2, 3,4,5,6,7], 5, true);
        this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 5, true);
        this.player.animations.add('idleRight', [8], 5, true);
        this.player.animations.add('idleLeft', [0], 5, true);

        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

         // Start listening for events
        initializeRemotePlayers('viewing4');
        createDoors.call(this);
        createSigns.call(this);

          //text settings

        setEventHandlers.bind(this)();


    },
  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewing4', id: clientId});
    artGame.lastRoom = 'viewing4';
    $('form').off('submit');

    if(door.targetTilemap==='viewing5'){
        clientRoom = 'viewing5';
        this.state.start('viewing5');

    }
    else if(door.targetTilemap==='viewing3'){
        clientRoom = 'viewing3';
        this.state.start('viewing3');
    }


  },

  touchSign: function(player, sign) {
    lastOverlapped = game.time.now + 100;
    showSign('Untitled (Broken I) and<br> Untitled (Broken II)', '', 'Harry Hughes');
  },
    update: function(){


        updateRemotePlayers(remotePlayers);
        collisionSetUp.call(this, true);

        removeSign(lastOverlapped);
        playerMovementAndAnimation.call(this, socket, clientRoom);
    }

};

