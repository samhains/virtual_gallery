var socket;
var remotePlayers = {};
var players = {};

var showSign = function(title, description, author) {
  if(!$('.sign')[0]){
    $('body').prepend("<div class='sign'><div class='bold-text title'>"+
        title+"</div><div>"+
        description+"</div><div class='author'>"+author+"</div></div>"); 
  }

};

var removeSign = function(lastOverlapped){
  if(lastOverlapped && game.time.now > lastOverlapped){
    $('.sign').remove();
  }
};

var getPlayers = function(){
        $.ajax({
            url:'getPlayers',
            type: 'get',
            async: false,
            success: function(playerData){
                players = playerData;
            }
        });



    };

var initializeGame = function(){

  debugger;

        socket = io(window.location.href+"viewing1");
        setUpChat.call(this,socket);

        this.facing = "left";
        this.level = 'viewing1';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#ffffff';
        this.map = this.game.add.tilemap('viewing1');
        this.map.addTilesetImage('viewing1');
        this.layer = this.map.createLayer('Tile Layer 1');

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
        this.player.position.x = 400;
        this.player.position.y = 520;
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


    };
