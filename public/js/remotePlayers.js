


var RemotePlayer = function (id, game, startX, startY, test) {
    this.test =  test || null;
    var x = startX, y = startY;
    this.lastPosition = { x: x, y: y };
    this.alive = true;
    this.id = id;
    this.facing = 'right';
    this.chatText = game.add.bitmapText(null, null, 'carrier_command','', 7);
    this.textYBuffer = 0;
    this.textYBufferLineCount=1;
    this.textY = y-15;

    Phaser.Sprite.call(this, game, x, y, 'dude');

 
    this.animations.add('left', [0, 1, 2, 3,4,5,6,7], 5, false);
    this.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 5, false);
    this.animations.add('idleRight', [8], 5, true);
    this.animations.add('idleLeft', [0], 5, true);
    //this.player.anchor.setTo(0.5, 0.5);
    this.name = id.toString();
    game.add.existing(this);


    //this.player.body.immovable = true;
    //this.player.body.collideWorldBounds = true;
};
RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);

// RemotePlayer.prototype.setText = function(text){
//     this.chatText.setText(text);
// };


RemotePlayer.prototype.update = function() {

    if(this.lastPosition.x== this.position.x && (this.game.time.now - this.lastMoveTime)>110 ){
        this.animations.stop();
        if(this.facing=== 'left')
            this.animations.play('idleLeft');
        if(this.facing==='right')
            this.animations.play('idleRight');
    
    }
    
    this.lastPosition.x = this.position.x;
    this.lastPosition.y = this.position.y;

};

