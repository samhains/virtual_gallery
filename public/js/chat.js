var appendMessage = function(msg, player, sender) {
  
  $('#messages').append($("<div><li><b class='bold-text'>"+sender+': </b>'+msg+'</li></div>'));
  $('#messages').children(':last-child').css('margin-left', player.position.x);
  $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
  $('#messages').children(':last-child').delay(5000).slideUp();
};

var setUpChat = function(socket, room){
    var self = this;
    $( document ).ready(function() {
        $(".message-list").scrollTop($(".message-list")[0].scrollHeight);

        $('.welcome-form').submit(function(e){
          e.preventDefault();
          name = $('#name').val();

          if (name.length > 0 ) {
            clientName = name;
            $('#welcome-modal').hide();
          }
          $('#name').val(''); 
        });
          
        //$('.minimized-bar').hide();
        $('.message-form').submit(function(e){

            var msg = $('#m').val();
            e.preventDefault();
            appendMessage(msg, self.player, clientName);
            $('#m').val('');
            socket.emit('chat message', {msg: msg, room: clientRoom, user: clientId, sender: clientName});
            return false;
          });

        socket.on('chat message', function(data){
            console.log("heres my name", clientName);
            var remoteId = data.user;
            var msg = data.msg;
            var remotePlayer = remotePlayers[remoteId];
            var senderName = data.sender;
            appendMessage(msg, remotePlayer, senderName);
        });              

    });
};

