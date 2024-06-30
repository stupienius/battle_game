class Sprite{
    constructor({position,imageSrc}){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(){
        c.drawImage(this.image, this.position.x ,this.position.y);
    }

    update(){
        this.draw();
    }

}

class Fighter {
    constructor({position, velocity, color = "red", offset, imageSrc}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastkey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.jumpTime = 0;
        
        // New image properties
        this.image = new Image();
        this.image.src = imageSrc;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.scale = 1;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / 4), // Assuming 4 frames per row
            0,
            this.image.width / 4,
            this.image.height,
            this.position.x, 
            this.position.y,
            (this.image.width / 4) * this.scale,
            this.image.height * this.scale
        );

        // Attack box (optional, for debugging)
        if (this.isAttacking) {
            c.fillStyle = "green";
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y,
                this.attackBox.width, 
                this.attackBox.height
            ); 
        }
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < 3) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y > canvas.height - 97) {
            this.velocity.y = 0;
            this.position.y = canvas.height - 97 - this.height;
            this.jumpTime = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}