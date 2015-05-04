var FONT_SIZE = 9;
var MSG_TIMEOUT = 4000;
var MSG_Y_SPACING = 16;
var MSG_REMOVE_TIMER = 8000;

var setUpChat = function(socket, room){
    var self=this;
    $( document ).ready(function() {
            $('form').submit(function(e){

                e.preventDefault();
                var msg = $('#m').val();
                socket.emit('chat message', {msg: msg, room: clientRoom, user: clientId});
                if(chatText){
                    chatText.destroy();
                }
                if(msg.length>20)
                    msg = makeParagraph.call(self,msg);

                
                var chatText = self.game.add.bitmapText(null, self.player.y-30+self.textYBuffer, 'carrier_command',msg, FONT_SIZE);
                chatText.x = self.player.x+MSG_Y_SPACING- chatText.textWidth*0.5;
                self.textYBuffer-=MSG_Y_SPACING;
                //add event timer to fade out text after 2 seconds
                self.game.time.events.add(MSG_TIMEOUT, function() {
                    //fade text
                   self.game.add.tween(chatText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
                    setTimeout(function(){
                      
                        self.textYBuffer+=MSG_Y_SPACING*self.textYBufferLineCount;
                        self.textYBufferLineCount=1;
                        chatText.destroy();
                    },MSG_REMOVE_TIMER);
                });                 

                $('#m').val('');
                return false;
              });
            
            socket.on('chat message', function(data){
                console.log('received msg', data);
                var remoteId = data.user;
                var msg = data.msg;
                var remotePlayer = remotePlayers[remoteId];
                if(msg.length>20)
                    msg = makeParagraph.call(remotePlayer,msg);

                var chatText = self.game.add.bitmapText(null, remotePlayer.position.y-30+remotePlayer.textYBuffer, 'carrier_command',msg, FONT_SIZE);

                chatText.x = remotePlayer.position.x+18- chatText.textWidth*0.5;
                remotePlayer.textYBuffer-=MSG_Y_SPACING;
                //add event timer to fade out text after 2 seconds
                self.game.time.events.add(MS_TIMEOUT, function() {
                    //fade text
                   self.game.add.tween(chatText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
                    setTimeout(function(){
                        remotePlayer.textYBuffer+=MSG_Y_SPACING*remotePlayer.textYBufferLineCount;
                        chatText.destroy();
                    },MSG_REMOVE_TIMER);
                });      
              
            });

        });
};


var makeParagraph = function( msg ) {
        var msgArr = msg.split('');
        var msgArrLength = msgArr.length;

        for(var i=1; i<msgArrLength;i++){
            if(i%17===0){
                if(/[a-zA-Z]/.test(msgArr[i]))
                    msgArr.splice(i,0,'-\n');                
                else
                    msgArr.splice(i,0,'\n');
            
                this.textYBuffer-=MSG_Y_SPACING; 
                this.textYBufferLineCount++;
              
                msgArrLength++;
            }
        }
        return msgArr.join('');
    
};