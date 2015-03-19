RemotePlayer = function (index, game, player, startX, startY) {
    var x = startX;
    var y = startY;
    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;
    this.player = game.add.sprite(x, y, 'dude');

    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    //this.player.anchor.setTo(0.5, 0.5);
    this.player.name = index.toString();


    //this.player.body.immovable = true;
    //this.player.body.collideWorldBounds = true;
    this.lastPosition = { x: x, y: y };
};


RemotePlayer.prototype.update = function() {
    //console.log("player.x",this.player.x,"lastPos",this.lastPosition.x);
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

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/starstruck/tiles-1.png');
    game.load.spritesheet('dude', 'assets/starstruck/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/starstruck/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/starstruck/star.png');
    game.load.image('starBig', 'assets/starstruck/star2.png');
    game.load.image('background', 'assets/starstruck/background2.png');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var remotePlayers = [];
var socket;

function create() {
    socket = io();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';
    

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;


    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

     // Start listening for events
    setEventHandlers();

}

function update() {
    for (var i = 0; i < remotePlayers.length; i++)
    {
        if (remotePlayers[i].alive)
            remotePlayers[i].update();
            //game.physics.collide(player, remotePlayers[i].player);
    }

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
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

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
    socket.emit("move player", {x: player.x, y:player.y});

}




function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

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
    remotePlayers.push(new RemotePlayer(data.id,game,player,data.x,data.y));

};

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;

};

function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);

};

// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].player.name == id)
            return remotePlayers[i];
    };

    return false;
};

