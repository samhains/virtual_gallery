
artGame.viewingFilm3 = function(){};


artGame.viewingFilm3.prototype = {
    preload: getPlayers, 

    create: function(){
        //remotePlayers = {};

        socket = io(window.location.href+"viewingFilm3");

        socket.emit('join room', {room:'viewingFilm3', id: clientId});

        setUpChat.call(this,socket);
        if(music) music.pause();
        $('#kill-video').show();
        $('#kill-video').prop('muted', false);
        var vid = document.getElementById('kill-video');
        vid.volume = 0.5;
        this.facing = "left";
        this.level = 'viewingFilm3';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#ffffff';

        //this.game.add.tileSprite(0, 0, 800, 608, 'viewingFilm3-background');
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
        this.player.position.y = 510;
        clientRoom = 'viewingFilm3';



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
        this.createSigns();
        setEventHandlers.bind(this)();


    },
    initializeRemotePlayers: function(){
        for(var remotePlayerId in remotePlayers){
            remotePlayers[remotePlayerId].destroy();
        }
        remotePlayers = {};
        for(var id in players){
            var player = players[id];
            if(player.room==="viewingFilm3" && clientId !== player.id){
       
                remotePlayers[player.id] = new RemotePlayer(player.id,this.game,player.x,player.y);
            }


        }
    },
     createSigns: function() {
    //create signs
        this.signs = this.game.add.group();
        this.signs.enableBody = true;
        result = this.findObjectsByType('sign', this.map, 'Object Layer 1');

        result.forEach(function(element){
          this.createFromTiledObject(element, this.signs);
        }, this);
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
        this.game.physics.arcade.overlap(this.player, this.signs, this.touchSign, null, this);
        removeSign(lastOverlapped);

         playerMovementAndAnimation.call(this, socket, clientRoom);
    }
};

