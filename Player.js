var Player = function(startX, startY) {

    // server needs to know X and Y variables
    var x = startX,
        y = startY,
        id,
        r = 'lobby';

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };
    var setRoom = function(room){
        r = room;
    };
    var getRoom = function(){
        return r;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        setRoom: setRoom,
        getRoom: getRoom
    };
};

exports.Player = Player;