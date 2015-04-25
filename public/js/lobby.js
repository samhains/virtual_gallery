var socket;



artGame.lobby = function(){};

artGame.lobby.prototype = {
    preload: function(){
        $.ajax({
            url:'getPlayers',
            type: 'get',
            async: false,
            success: function(playerData){
                players = playerData;


            }
        });


    },
    create: function(){
        socket = new io.connect("http://localhost:5000/lobby");
        // for(var id in viewingPlayers){
        //     var remotePlayer = viewingPlayers[id];
        //     remotePlayer.kill();
        // }

        

        $( document ).ready(function() {
            $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
            $('.minimized-bar').hide();
            $('form').submit(function(e){

                e.preventDefault();
                socket.emit('chat message', $('#m').val());
                $('#m').val('');
                return false;
              });
            $('.minimize').on('click',function(){
                $('.chat-box').hide();
                $('.minimized-bar').show();
            });
            $('.maximize').on('click',function(){
                $('.chat-box').show();
                $('.minimized-bar').hide();
            });
            socket.on('chat message', function(msg){

                $('#messages').append($('<li>').text(msg));
                $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
            });

        });

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#ffffff';
        this.facing = 'left';

        this.level = 'lobby';

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('tiles-1');

        this.map.setCollisionBetween(9, 50);




        this.layer = this.map.createLayer('Tile Layer 1');



        //  Un-comment this on to see the collision tiles
        // layer.debug = true;


        this.layer.resizeWorld();

        this.player = this.game.add.sprite(32, 32, 'dude');


        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        this.player.body.drag.set(0.2);
        this.player.level = "lobby";
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(5, 32, 5, 16);
        this.player.position.x = 100;
        this.player.position.y = 300;
        this.player.room = 'lobby';
        socket.emit("new player", {x: this.player.x, y: this.player.y, room:'lobby'});



        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        // jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

         // Start listening for events

        //this.initializeRemotePlayers();
        this.createDoors();
        setEventHandlers.bind(this)();


        //Object.keys(doorsObj)
        // doorsArr.forEach(function(element){

        // });



    },
    initializeRemotePlayers: function(){
        remotePlayers = {};

        for(var id in players){
            var player = players[id];
            //&& this.player.id !== player.id
            if(player.room==="lobby" ){
                console.log(this.player, this.player.id,'player', player.id);
                remotePlayers[player.id] = new RemotePlayer(player.id,this.game,player.x,player.y);
            }


        }
        console.log('just printed remote players',players, remotePlayers);
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
    socket.emit('leave room', {room:'lobby', id: socket.id});
    socket.emit('join room', {room:'viewing1', id: socket.id});
    
    //socket.emit("remove player", {id: socket.id, room: 'lobby'});
    this.player.room = 'viewing1';
    this.state.start('viewing1');


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
                remotePlayers[id].update();
        }
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        //console.log(this.input.activePointer.x,this.input.activePointer.isDown );

        if (this.cursors.left.isDown )
        {
            console.log(remotePlayers);

            this.player.body.velocity.x = -150;

            if (this.facing != 'left')
            {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 150;

            if (this.facing != 'right')
            {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        }
        else if (this.cursors.up.isDown )
        {
            this.player.body.velocity.y = -150;

        }
        else if (this.cursors.down.isDown )
        {
            this.player.body.velocity.y = 150;


        }
        else
        {
            if (this.facing != 'idle')
            {
                this.player.animations.stop();

                if (this.facing == 'left')
                {
                    this.player.frame = 0;
                }
                else
                {
                    this.player.frame = 5;
                }

                this.facing = 'idle';
            }
        }

        if (this.player.lastPosition.x !== this.player.x || this.player.lastPosition.y !== this.player.y){
            socket.emit("move player", {x: this.player.x, y:this.player.y, room: 'lobby'});
        }
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        }
};






