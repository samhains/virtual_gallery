function playerMovementAndAnimation(socket, room){

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
  

        if (this.cursors.left.isDown )
        {   


            this.player.body.velocity.x = -60;

            if (this.facing != 'left')
            {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 60;

            if (this.facing != 'right')
            {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        }
        else if (this.cursors.up.isDown )
        {   

            this.player.body.velocity.y = -60;
            if(this.facing == 'left')
                this.player.animations.play('left');
            else 
                this.player.animations.play('right');
            

        }
        else if (this.cursors.down.isDown )
        {
            this.player.body.velocity.y = 60;
            if(this.facing == 'right')
                this.player.animations.play('right');
            else
                this.player.animations.play('left');


        }
        else
        {
           
                this.player.animations.stop();
                

                if (this.facing == 'left')
                {
                    this.player.animations.play('idleLeft');
                }
                else
                {
                    this.player.animations.play('idleRight');
                }

                this.facing = 'idle';

            
        }

        if (this.player.lastPosition.x !== this.player.x || this.player.lastPosition.y !== this.player.y){
            socket.emit("move player", {x: this.player.x, y:this.player.y, room:room});
        }
        this.player.lastPosition = { x: this.player.x, y: this.player.y };
        }
