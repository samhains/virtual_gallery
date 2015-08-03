var socket;
var remotePlayers = {};
var players = {};

var showSign = function(title, description, author) {
  if(!$('.sign')[0]){
    $('body').prepend("<div class='sign'><div class='bold-text title'>"+
        title+"</div><div>"+
        description+"</div><div class='author'>"+author+"</div></div>"); 
  }

};

var removeSign = function(lastOverlapped){
  if(lastOverlapped && game.time.now > lastOverlapped){
    $('.sign').remove();
  }
};

var getPlayers = function(){
        $.ajax({
            url:'getPlayers',
            type: 'get',
            async: false,
            success: function(playerData){
                debugger;
                players = playerData;
            }
        });



    };
