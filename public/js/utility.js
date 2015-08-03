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
