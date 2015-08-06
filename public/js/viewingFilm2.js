
artGame.viewingFilm2 = function(){};


artGame.viewingFilm2.prototype = {
    preload: getPlayers, 

    create: function(){
        //remotePlayers = {};

        socket = io(window.location.href+"viewingFilm2");

        setUpChat.call(this,socket);
        music.pause();
        $('#tek-video').show();
        $('#tek-video').prop('muted', false);
        var vid = document.getElementById('tek-video');
        vid.volume = 0.5;
        this.facing = "left";
        this.level = 'viewingFilm2';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#ffffff';

        //this.game.add.tileSprite(0, 0, 800, 608, 'viewingFilm2-background');
        this.map = this.game.add.tilemap('viewingHorse');

        this.map.addTilesetImage('viewingHorse');

       // this.map.setCollisionBetween(1707, 1714);
        this.map.setCollisionBetween(1504, 1545);
        this.map.setCollision([1851, 1852, 1802, 1752, 1703, 1653, 1604, 1554,1546, 1596, 1646, 1647, 1697, 1747, 1748, 1749, 1798, 1799, 1849, 1848, 1899]);
        this.layer = this.map.createLayer('Tile Layer 1');


        //  Un-comment this on to see the collision tiles
        //this.layer.debug = true;


        //this.layer.resizeWorld();

        this.player = this.game.add.sprite(32, 32, 'dude');
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        this.player.body.drag.set(0.2);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(5, 32, 5, 16);
        this.player.position.x = 400;
        this.player.position.y = 520;
        clientRoom = 'viewingFilm2';



        this.player.animations.add('left', [0, 1, 2, 3,4,5,6,7], 5, true);
        this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 5, true);
        this.player.animations.add('idleRight', [8], 5, true);
        this.player.animations.add('idleLeft', [0], 5, true);


        this.textMessages = this.game.add.group(); 
        this.textYBuffer = 0;
        this.textY = this.player.position.y-15;
        this.lastChatMessageWidth;
        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

         // Start listening for events
        this.initializeRemotePlayers();
        this.createDoors();
        setEventHandlers.bind(this)();


    },
    initializeRemotePlayers: function(){
        for(var remotePlayerId in remotePlayers){
            remotePlayers[remotePlayerId].destroy();
        }
        remotePlayers = {};
        for(var id in players){
            var player = players[id];
            if(player.room==="viewingFilm2" && clientId !== player.id){
       
                remotePlayers[player.id] = new RemotePlayer(player.id,this.game,player.x,player.y);
            }


        }
    },
     createDoors: function() {
    //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'Object Layer 1');

        result.forEach(function(element){
          this.createFromTiledObject(element, this.doors);
        }, this);
  },
  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewingFilm2', id: socket.id});
    artGame.lastRoom = 'viewingFilm2';
    socket.emit('join room', {room:'viewing2', id: socket.id});
    clientRoom = 'viewing2';
    this.state.start('viewing2');



  },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //console.log(element);
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
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

         playerMovementAndAnimation.call(this, socket, clientRoom);
    }
};

