var artGame = artGame || {};

artGame.game = new Phaser.Game(800, 608, Phaser.AUTO, '');

artGame.game.state.add('Preload', artGame.Preload);
artGame.game.state.add('lobby', artGame.lobby);
artGame.game.state.add('viewing1', artGame.viewing1);
artGame.game.state.start('Preload');
