
var lastMessage;
var appendMessage = function(msg, player, sender) {
  $('#messages').append($("<div><li><b class='bold-text'>"+sender+': </b>'+msg+'</li></div>'));
  $('#messages').children(':last-child').css('margin-left', player.position.x);
  $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
  $('#messages').children(':last-child').delay(10000).slideUp();
};

var setUpChat = function(socket, room){
    var self = this;
    $( document ).ready(function() {
        $(".message-list").scrollTop($(".message-list")[0].scrollHeight);

        $('.message-form').submit(function(e){

            var msg = $('#m').val();
            e.preventDefault();
            if(msg.length>0 ){
              appendMessage(msg, self.player, clientName);
              socket.emit('chat message', {msg: msg, room: clientRoom, user: clientId, sender: clientName});
            }
            $('#m').val('');
            return false;
          });

        socket.on('chat message', function(data){
            var msg = data.msg;
            if(lastMessage != msg) {
              var remoteId = data.user;
              var remotePlayer = remotePlayers[remoteId];
              var senderName = data.sender;
              appendMessage(msg, remotePlayer, senderName);
            }

            lastMessage = msg;
        });


    });
};

