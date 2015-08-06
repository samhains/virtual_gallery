var artGame = artGame || {};




artGame.Preload = function(){};

artGame.Preload.prototype = {

	preload: function(){
        this.game.time.advancedTiming = true;
        //this.game.load.image("viewing1-background", "assets/sam/viewing1.png");
        this.load.image('stars', 'assets/sam/stars.png');
        this.game.load.audio('vacancy', ['assets/sam/Vacancy.mp3','assets/sam/Vacancy.ogg']);
        this.game.load.bitmapFont('carrier_command', 'assets/sam/carrier_command.png', 'assets/sam/carrier_command.xml');

        this.game.load.tilemap('level1', 'assets/sam/entrance.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('entrance', 'assets/sam/entrance.png');

        this.game.load.tilemap('viewing1', 'assets/sam/viewing1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('viewing1', 'assets/sam/viewing1.png');
        
        this.game.load.tilemap('viewingHorse', 'assets/sam/viewingHorse.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('viewingHorse', 'assets/sam/viewingHorse.png');
        
        this.game.load.tilemap('viewing2', 'assets/sam/viewing2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('viewing2', 'assets/sam/viewing2.png');

        this.game.load.tilemap('viewing3', 'assets/sam/viewing3.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('viewing3', 'assets/sam/viewing3.png');
       
        //this.game.load.image('door', 'assets/sam/door.png');
        

        this.game.load.spritesheet('dude', 'assets/sam/dude.png', 32, 32);

	},
	create: function(){
		this.state.start('entrance');

	}

};
