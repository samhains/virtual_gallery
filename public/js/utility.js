var socket;
var remotePlayers = {};
var players = {};
var clientId;
var clientRoom;
var clientName;
var music;
var bgScrollTimer;


var destroyText= function(){
    chatText.destroy();
};

var welcomeScroll = function(speed){

  name = $('#name').val();
      
  var scrollSpeed = 70;

  // set the default position
  var current = 0;

  // set the direction
  var direction = 'h';

  function bgscroll(){

      // 2 pixel row at a time
      current -= speed;
 
      // move the background with backgrond-position css properties
      $('div#welcome-modal').css("backgroundPosition", (direction == 'h') ? current+"px 0" : "0 " + current+"px");
 
  }

  //Calls the scrolling function repeatedly
   bgScrollTimer = setInterval(bgscroll, scrollSpeed);    
};

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


var initializeRemotePlayers= function(levelName){

    for(var remotePlayerId in remotePlayers){
        remotePlayers[remotePlayerId].destroy();
    }
    remotePlayers = {};
    for(var id in players){
        var player = players[id];
        if(player.room===levelName && clientId !== player.id){
   
            remotePlayers[player.id] = new RemotePlayer(player.id,this.game,player.x,player.y);
        }


    }
};

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  var findObjectsByType = function(type, map, layer) {
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
  };


//create a sprite from an object
var createFromTiledObject = function(element, group) {
  var sprite = group.create(element.x, element.y, element.properties.sprite);

    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
};

var createSigns = function(){
    //create signs
    this.signs = this.game.add.group();
    this.signs.enableBody = true;
    result = findObjectsByType('sign', this.map, 'Object Layer 1');

    result.forEach(function(element){
      createFromTiledObject(element, this.signs);
    }, this);
};

var createDoors = function() {
  this.doors = this.game.add.group();
  this.doors.enableBody = true;
  result = findObjectsByType('door', this.map, 'Object Layer 1');

  result.forEach(function(element){
    createFromTiledObject(element, this.doors);
  }, this);
};

var createFilmLevel = function(name, videoId, isMusic){
    socket.emit('join room', {room: name, id: clientId});

    setUpChat.call(this,socket);

    if(isMusic){
      $('#'+videoId).prop('muted', false);
      var vid = document.getElementById(videoId);
      vid.volume = 0.5;

      if(music) music.pause();
    }

    $('#'+videoId).show();
    this.facing = "left";
    this.level = name;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.stage.backgroundColor = '#ffffff';

    //this.game.add.tileSprite(0, 0, 800, 608, namebackground');
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
    clientRoom = name;



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
    initializeRemotePlayers(name);

    createDoors.call(this);
    createSigns.call(this);
    setEventHandlers.call(this);

};

