var Player = function(startX, startY) {

    // server needs to know X and Y variables
    this.x = startX;
    this.y = startY;
    this.room = 'lobby';

};

exports.Player = Player;