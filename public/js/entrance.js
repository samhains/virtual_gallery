var socket;
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


artGame.entrance = function(){};

artGame.entrance.prototype = {
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
        socket = io(window.location.href);
         
        if(artGame.lastRoom){
          socket.emit('join room', {room:'entrance', id: clientId});
        }

        setUpChat.call(this,socket);
        var self = this;


        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#ffffff';
        this.facing = 'left';
        game = this.game;

        
        this.level = 'entrance';
        this.stars = this.game.add.tileSprite(0,0,800,608,'stars');
        this.stars.autoScroll(-20,0);
        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('entrance');
        this.map.setCollisionBetween(1600, 1620);
        this.map.setCollision([1671, 1773]);
        this.map.setCollisionBetween(1824 , 1849);
  

        //this.map.setCollisionBetween(9, 50);


        this.layer = this.map.createLayer('Tile Layer 1');
        
        //  Un-comment this on to see the collision tiles
        //this.layer.debug = true;



        this.layer.resizeWorld();

        this.player = this.game.add.sprite(32, 32, 'dude');


        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        this.player.body.drag.set(0.2);

        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(5, 32, 5, 16);

        if(artGame.lastRoom == 'viewing1'){
          this.player.position.x = 300;
          this.player.position.y = 537;
        }
        else{
          this.player.position.x = 50;
          this.player.position.y = 550;
          socket.emit("new player", {x: this.player.x, y: this.player.y, room:'entrance'});
        }

        clientRoom = "entrance";

        this.player.animations.add('left', [0, 1, 2, 3, 4,5,6,7], 10, true);
        this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.player.animations.add('idleRight', [8], 5, true);
         this.player.animations.add('idleLeft', [0], 5, true); 

        //text settings
        this.textMessages = game.add.group(); 
        this.textYBuffer = 0;
        this.textYBufferLineCount = 1;
        this.textY = this.player.y-15;
        this.lastChatMessageWidth;

        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        var that = this;

        if($('#welcome-modal').is(':visible')){
    

            $('#loading-message').hide();
            $('.welcome-form').show();
            welcomeScroll(1);
            $('.welcome-form').submit(function(e){
              e.preventDefault();
              name = $('#name').val();
              if (name.length > 0 ) {
                clientName = name;
                $('#welcome-modal').remove();
                clearInterval(bgScrollTimer);
                $('.message-form').show();
                music = that.game.add.audio('vacancy',1,true);
                music.play('', 0, 1, true);
              }
              $('#name').val(''); 

            });

        }


        if(!music && clientName){
             music = this.game.add.audio('vacancy',1,true);
             music.play('', 0, 1, true);
             
        }
       
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
      
           
            if(player.room==="entrance" && player.id !== clientId ){
               
                remotePlayers[player.id] = new RemotePlayer(player.id,this.game,player.x,player.y);
            }


        }
      
    },
    createDoors: function() {
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'Object Layer 1');

        result.forEach(function(element){
          this.createFromTiledObject(element, this.doors);
        }, this);
  },
  enterDoor: function(player, door) {
    //`('ENTER DOOR this.player id and level',clientId,clientRoom);
    socket.emit('leave room', {room:'entrance', id: clientId});
    artGame.lastRoom = 'entrance';

    //socket.emit("remove player", {id: socket.id, room: 'entrance'});
    clientRoom = 'viewing1';
    this.state.start('viewing1');
    $('form').off('submit');


  },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
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
                remotePlayers[id].update();
        }
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        playerMovementAndAnimation.call(this, socket, clientRoom);
    },

};






