var artGame = artGame || {};

artGame.Preload = function(){};

artGame.Preload.prototype = {

	preload: function(){
        this.game.time.advancedTiming = true;
        //this.game.load.image("viewing1-background", "assets/sam/viewing1.png");
        this.load.image('stars', 'assets/sam/stars.png');
        this.game.load.tilemap('level1', 'assets/sam/entrance.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('viewing1', 'assets/sam/viewing1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('viewingEnd', 'assets/sam/viewingEnd.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('entrance', 'assets/sam/entrance.png');
        //this.game.load.image('door', 'assets/sam/door.png');
        this.game.load.image('viewing1', 'assets/sam/viewing1.png');
        this.game.load.image('viewingEnd', 'assets/sam/viewingEnd.png');
        this.game.load.spritesheet('dude', 'assets/sam/dude.png', 32, 32);

	},
	create: function(){
		this.state.start('entrance');

	}

};