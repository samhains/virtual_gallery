var remotePlayers = {};
var socket;





var RemotePlayer = function (id, game, player, startX, startY) {
    var x = startX;
    var y = startY;
    this.level = "lobby";
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