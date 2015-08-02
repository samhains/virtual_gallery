var appendMessage = function(msg, player) {
  $('#messages').append($('<li>').text(msg));
  $('#messages').children(':last-child').css('margin-left', player.position.x);
  $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
  $('#messages').children(':last-child').delay(5000).slideUp();
  $('#messages').append($('<div>'));
  $('#messages').children(':last-child').delay(5000).slideUp();
};

var setUpChat = function(socket, room){
    var self = this;
    $( document ).ready(function() {
        $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
          
        //$('.minimized-bar').hide();
        $('form').submit(function(e){

            var msg = $('#m').val();
            e.preventDefault();
            appendMessage(msg, self.player);
            $('#m').val('');
            socket.emit('chat message', {msg: msg, room: clientRoom, user: clientId});
            return false;
          });
        socket.on('chat message', function(data){

            var remoteId = data.user;
            var msg = data.msg;
            var remotePlayer = remotePlayers[remoteId];
            appendMessage(msg, remotePlayer);
        });              

    });
};

