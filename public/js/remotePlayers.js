var socket;
var lobbyPlayers = {};
var viewingPlayers = {};




var RemotePlayer = function (id, game, startX, startY, test) {
    this.test =  test || null;
    var x = startX, y = startY;
    this.lastPosition = { x: x, y: y };
    this.alive = true;
    this.id = id;

    Phaser.Sprite.call(this, game, x, y, 'dude');


    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('turn', [4], 20, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    //this.player.anchor.setTo(0.5, 0.5);
    this.name = id.toString();
    game.add.existing(this);


    //this.player.body.immovable = true;
    //this.player.body.collideWorldBounds = true;
};
RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);


RemotePlayer.prototype.update = function() {
    // if(this.lastPosition.x>this.player.x) {
    //     this.player.animations.play('left');
    // } else if(this.lastPosition.x<this.player.x){
    //     this.player.animations.play('right');

    // }
    // else if(this.lastPosition.x==this.player.x){
    //     this.player.animations.stop();
    // }

    this.lastPosition.x = this.position.x;
    this.lastPosition.y = this.position.y;

};

