var artGame = artGame || {};

artGame.game = new Phaser.Game(800, 608, Phaser.AUTO, '');

artGame.game.state.add('Preload', artGame.Preload);
artGame.game.state.add('entrance', artGame.entrance);
artGame.game.state.add('viewing1', artGame.viewing1);
artGame.game.state.add('viewing2', artGame.viewing2);
artGame.game.state.add('viewing3', artGame.viewing3);
artGame.game.state.add('viewing4', artGame.viewing4);
artGame.game.state.add('viewing5', artGame.viewing5);
artGame.game.state.add('viewingHorse', artGame.viewingHorse);

artGame.game.state.add('viewingFilm2', artGame.viewingFilm2);
artGame.game.state.add('viewingFilm3', artGame.viewingFilm3);

artGame.game.state.start('Preload');
