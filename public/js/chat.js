var FONT_SIZE = 9;
var MSG_TIMEOUT = 4000;
var MSG_Y_SPACING = 16;
var MSG_REMOVE_TIMER = 8000;

var setUpChat = function(socket, room){
    var self = this;
    $( document ).ready(function() {
        $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
          
        //$('.minimized-bar').hide();
        $('form').submit(function(e){
            console.log("form submit!");

            var msg = $('#m').val();
            e.preventDefault();
            $('#messages').append($('<li>').text(msg));
            console.log('position of player is' , self.player.position.x);
            $('#messages').children(':last-child').css('margin-left', self.player.position.x);
            $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
            $('#messages').children(':last-child').delay(5000).slideUp();
            socket.emit('chat message', msg);
            $('#m').val('');
            return false;
          });
        //$('.minimize').on('click', function(){
            //$('.chat-box').hide();
            ////$('.minimized-bar').show();
        //});
        //$('.maximize').on('click', function(){
            //$('.chat-box').show();
            //$('.minimized-bar').hide();
        //});
        socket.on('chat message', function(data){

            var remoteId = data.user;
            var msg = data.msg;
            var remotePlayer = remotePlayers[remoteId];
            $('#messages').append($('<li>').text(msg));
            $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
        });              

    });
};


