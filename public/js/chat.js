var setUpChat = function(socket){
    var self=this;
    $( document ).ready(function() {
            $('form').submit(function(e){

                e.preventDefault();
                var msg = $('#m').val();
                //socket.emit('chat message', {msg: msg, room: clientRoom, user: clientId});
                console.log('player x', self.player.x, 'player y', self.player.y);
                var chatText = self.game.add.bitmapText(null, self.player.y-30+self.textYBuffer, 'carrier_command',msg, 7);
                chatText.x = self.player.x+18- chatText.textWidth*0.5;
                // console.log('adding text to ', self.player.x+18- chatText.textWidth*0.5, self.player.y-30+self.textYBuffer);
                // console.log('adding text to (modified) ', self.player.x, self.player.y);

                // console.log('chat text position',chatText.position.x, chatText.position.y);
                //self.textYBuffer-=15;
                //add event timer to fade out text after 2 seconds
                self.game.time.events.add(2000, function() {
                    //fade text
                   self.game.add.tween(chatText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
                  
                       // self.textYBuffer+=15;
                        chatText.destroy();
                    //       setTimeout(function(){
                    // },6000);
                });                 

                $('#m').val('');
                return false;
              });
            
            socket.on('chat message', function(data){
                console.log('received msg', data);
                var remoteId = data.user;
                var msg = data.msg;
                var remotePlayer = remotePlayers[remoteId];

                var chatText = self.game.add.bitmapText(null, remotePlayer.position.y-30+remotePlayer.textYBuffer, 'carrier_command',msg, 7);
                chatText.x = remotePlayer.position.x+18- chatText.textWidth*0.5;
                remotePlayer.textYBuffer-=15;
                //add event timer to fade out text after 2 seconds
                self.game.time.events.add(2000, function() {
                    //fade text
                   self.game.add.tween(chatText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
                    setTimeout(function(){
                        remotePlayer.textYBuffer+=15;
                        chatText.destroy();
                    },6000);
                });      
              

                // $('#messages').append($('<li>').text(msg));
                // $(".message-list").scrollTop($(".message-list")[0].scrollHeight);
            });

        });
};