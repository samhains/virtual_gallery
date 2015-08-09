var lastOverlapped;

artGame.viewing1 = function(){};


artGame.viewing1.prototype = {
    preload: getPlayers, 
    create: function(){


        setUpChat.call(this,socket);

        this.facing = "left";
        this.level = 'viewing1';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#ffffff';
        this.map = this.game.add.tilemap('viewing1');
        this.map.addTilesetImage('viewing1');
        this.layer = this.map.createLayer('Tile Layer 1');

        socket.emit('join room', {room:'viewing1', id: clientId});


        if(music && !music.isPlaying){
                music.play('', 0,1,true);
         }    

        this.map.setCollisionBetween(1504, 1545);
        this.map.setCollision([1851, 1852, 1802, 1752, 1703, 1653, 1604, 1554, 1693, 1592, 1593, 1594, 1694, 1695,1643, 1644, 1649, 1699, 1546, 1596, 1647, 1697, 1748, 1749, 1799, 1849, 1642]);


        //this.layer.resizeWorld();

        this.player = this.game.add.sprite(32, 32, 'dude');
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        this.player.body.drag.set(0.2);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(5, 32, 5, 16);

        if(artGame.lastRoom == 'entrance'){
          this.player.position.x = 295;
          this.player.position.y = 510;
        }

        else if(artGame.lastRoom == 'viewing2'){
          this.player.position.x = 495;
          this.player.position.y = 510;
        }

        clientRoom = 'viewing1';
       




        this.player.animations.add('left', [0, 1, 2, 3,4,5,6,7], 5, true);
        this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 5, true);
        this.player.animations.add('idleRight', [8], 5, true);
        this.player.animations.add('idleLeft', [0], 5, true);

        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

         // Start listening for events
        this.initializeRemotePlayers();
        this.createDoors();
        this.createSigns();

          //text settings

        setEventHandlers.bind(this)();


    },
    initializeRemotePlayers: function(){
        for(var remotePlayerId in remotePlayers){
            remotePlayers[remotePlayerId].destroy();
        }
        remotePlayers = {};
        for(var id in players){
            var player = players[id];
                

            if(player.room==="viewing1"  && clientId !== player.id){
                
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
  enterDoor: function(player, door) {
    socket.emit('leave room', {room:'viewing1', id: clientId});
    artGame.lastRoom = 'viewing1';
    $('form').off('submit');
    

    if(door.targetTilemap==='viewing2'){
        clientRoom = 'viewing2';
        this.state.start('viewing2');

    }
    if(door.targetTilemap==='entrance'){
        clientRoom = 'entrance';
        this.state.start('entrance');
    }


  },

  touchSign: function(player, sign) {
    lastOverlapped = game.time.now + 100;
    showSign('Untitled', '', 'Charlie Freedman');
  },
    
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = [];
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
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

