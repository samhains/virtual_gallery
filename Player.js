var Player = function(startX, startY) {

    // server needs to know X and Y variables
    this.x = startX;
    this.y = startY;
    this.room = 'entrance';

};

exports.Player = Player;