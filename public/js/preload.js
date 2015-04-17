var artGame = artGame || {};

artGame.Preload = function(){};

artGame.Preload.prototype = {

	preload: function(){
        this.game.time.advancedTiming = true;
        this.game.load.image("viewing1-background", "assets/sam/viewing1.png");
        this.game.load.tilemap('level1', 'assets/sam/entrance.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level2', 'assets/sam/firstArtRoom.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-1', 'assets/sam/BAW.png');
        this.game.load.image('door', 'assets/sam/door.png');
        this.game.load.image('tiles-2', 'assets/sam/BAW copy.png');
        this.game.load.spritesheet('dude', 'assets/sam/dot.png', 32, 48);

	},
	create: function(){
		this.state.start('lobby');

	}

};