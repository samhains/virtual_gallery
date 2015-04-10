var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var remotePlayers = {};
var socket;
var pointer;
var height = 0;



var  findObjectsByType = function(type, map, layer) {
    var result = [];
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
},


RemotePlayer = function (id, game, player, startX, startY) {
    var x = startX;
    var y = startY;
    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;
    this.player = game.add.sprite(x, y, 'dude');
    this.id = id;

    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    //this.player.anchor.setTo(0.5, 0.5);
    this.player.name = id.toString();


    //this.player.body.immovable = true;
    //this.player.body.collideWorldBounds = true;
    this.lastPosition = { x: x, y: y };
};


RemotePlayer.prototype.update = function() {
    if(this.lastPosition.x>this.player.x) {
        this.player.animations.play('left');
    } else if(this.lastPosition.x<this.player.x){
        this.player.animations.play('right');

    }
    else if(this.lastPosition.x==this.player.x){
        this.player.animations.stop();
    }

    this.lastPosition.x = this.player.x;
    this.lastPosition.y = this.player.y;

};


var gameLevels = {
};

gameLevels.lobby = function(){};

gameLevels.lobby.prototype = {
    preload: function(){
        game.time.advancedTiming = true;
        // game.load.tilemap('level1', 'assets/sam/entrance.json', null, Phaser.Tilemap.TILED_JSON);
        // game.load.image('tiles-1', 'assets/sam/BAW.png');
        // game.load.spritesheet('dude', 'assets/starstruck/dude.png', 32, 48);
        game.load.tilemap('level1', 'assets/sam/entrance.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles-1', 'assets/sam/BAW.png');
        game.load.spritesheet('dude', 'assets/starstruck/dude.png', 32, 48);
        game.load.spritesheet('droid', 'assets/starstruck/droid.png', 32, 32);
        game.load.image('starSmall', 'assets/starstruck/star.png');
        game.load.image('starBig', 'assets/starstruck/star2.png');
        game.load.image('background', 'assets/starstruck/background2.png');
    },
    create: function(){
        socket = io();
       $( document ).ready(function() {
            console.log("READY");
            $('.minimized-bar').hide();
            $('form').submit(function(e){


                e.preventDefault();
                socket.emit('chat message', $('#m').val());
                $('#m').val('');
                return false;
              });
              socket.on('chat message', function(msg){
                
                console.log('msg',msg);
                $('#messages').append($('<li>').text(msg));
                $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
        });
              $('.minimize').on('click',function(){
                $('.chat-box').hide();
                $('.minimized-bar').show();
              });
              $('.maximize').on('click',function(){
                $('.chat-box').show();
                $('.minimized-bar').hide();
              });

        });

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#ffffff';



        map = game.add.tilemap('level1');

        map.addTilesetImage('tiles-1');

        map.setCollisionBetween(9, 50);

        layer = map.createLayer('Tile Layer 1');

        //  Un-comment this on to see the collision tiles
        // layer.debug = true;


        layer.resizeWorld();

        player = game.add.sprite(32, 32, 'dude');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.lastPosition = { x: player.x, y: player.y };
        player.body.drag.set(0.2);
        player.body.collideWorldBounds = true;
        player.body.setSize(5, 32, 5, 16);
        player.position.x = 100;
        player.position.y = 300;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        game.camera.follow(player);

        cursors = game.input.keyboard.createCursorKeys();
        // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

         // Start listening for events
        setEventHandlers();

    },
    update: function(){

        for (var id in remotePlayers)
        {

            if (remotePlayers[id].alive)
                //could this be done asyncronously?
                remotePlayers[id].update();
        }
        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        //console.log(this.input.activePointer.x,this.input.activePointer.isDown );

        if (cursors.left.isDown || (this.input.activePointer.x < 399 && this.input.activePointer.isDown))
        {
            player.body.velocity.x = -150;

            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown || (this.input.activePointer.x > 400 && this.input.activePointer.isDown))
        {
            player.body.velocity.x = 150;

            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else if (cursors.up.isDown || (this.input.activePointer.x > 400 && this.input.activePointer.isDown))
        {
            player.body.velocity.y = -150;

        }
        else if (cursors.down.isDown || (this.input.activePointer.x > 400 && this.input.activePointer.isDown))
        {
            player.body.velocity.y = 150;


        }
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();

                if (facing == 'left')
                {
                    player.frame = 0;
                }
                else
                {
                    player.frame = 5;
                }

                facing = 'idle';
            }
        }

        // if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        // {
        //     player.body.velocity.y = -250;
        //     jumpTimer = game.time.now + 750;
        // }
        if (player.lastPosition.x !== player.x || player.lastPosition.y !== player.y){
            socket.emit("move player", {x: player.x, y:player.y});
        }
        player.lastPosition = { x: player.x, y: player.y };
        }
};

function render () {
     game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}






var game = new Phaser.Game(800, 608, Phaser.CANVAS, 'phaser-example', { preload: gameLevels.lobby.preload, create: gameLevels.lobby.create, update: gameLevels.lobby.update, render: render });
game.state.add('lobby',gameLevels.lobby);
game.state.start('lobby');





/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
};


function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {x: player.x, y:player.y});


};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    remotePlayers[data.id] = new RemotePlayer(data.id,game,player,data.x,data.y);

};

function onMovePlayer(data) {
    var movePlayer = remotePlayers[data.id];

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;

};

function onRemovePlayer(data) {
    var removePlayer = remotePlayers[data.id];

    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    delete remotePlayers[data.id];

};




