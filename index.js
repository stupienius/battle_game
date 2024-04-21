const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0 ,0 , canvas.width, canvas.height);

const gravity = 0.7;

class Sprite{
    constructor({position, velocity,color = "red",offset}){
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastkey ;
        this.attackBox = {
            position:{
                x:this.position.x,
                y:this.position.y
            },
            offset ,
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.position.x , this.position.y ,this.width,this.height);

        //attack Box
        if(this.isAttacking){
            c.fillStyle = "green";
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y,
                this.attackBox.width, 
                this.attackBox.height
            ); 
        }
        
    }

    update(){
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        }else this.velocity.y += gravity;
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        },100);
    }
}
   
const player = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset:{
        x:0,
        y:0
    }
});


const enemy = new Sprite({
    position:{
        x: 400,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    color: "blue",
    offset:{
        x: -50,
        y: 0
    }
});

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    }
}

function rectangularCollision({retangle1,retangle2}){
    return(
        retangle1.attackBox.position.x + retangle1.attackBox.width >= retangle2.position.x &&
        retangle1.attackBox.position.x <= retangle2.position.x + retangle2.width &&
        retangle1.attackBox.position.y + retangle1.attackBox.height >= retangle2.position.y &&
        retangle1.attackBox.position.y <= retangle2.position.y + retangle2.height
    )
}

function determineWinner({player,enemy,timeId}){
    clearTimeout(timeId);
    if(player.health === enemy.health){
        document.querySelector(".show").innerHTML = "Tie" ;
    }else if(player.health > enemy.health){
        document.querySelector(".show").innerHTML = "Player 1 Wins" ;
    }else{
        document.querySelector(".show").innerHTML = "Player 2 Wins" ;
    }
    document.querySelector(".show").style.display = "flex";
}

let time = 60;
let timeId ;
function decreaseTimer(){
    if(time > 0){ 
        timeId = setTimeout(decreaseTimer, 1000);
        time--;
        document.querySelector(".timer").innerHTML = time;
    }
    
    if(time === 0){
        determineWinner({player,enemy,timeId});
    }
}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();


    player.velocity.x = 0;
    enemy.velocity.x = 0;


    if(keys.a.pressed && player.lastkey === "a"){
        player.velocity.x = -5;
    }else if(keys.d.pressed && player.lastkey === "d"){
        player.velocity.x = 5;
    }

    if(keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight"){
        enemy.velocity.x = 5;
    }else if(keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft"){
        enemy.velocity.x = -5;
    }

    if(rectangularCollision({
        retangle1:player,
        retangle2:enemy
    })&&
        player.isAttacking
    ){
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('.enemy_health .health').style.width = enemy.health + "%";
    }

    if(rectangularCollision({
        retangle1:enemy,
        retangle2:player
    })&&
        enemy.isAttacking
    ){
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('.player_health .health').style.width = player.health + "%";
    }

    //end game based on health
    if(player.health <= 0 || enemy.health <= 0){
        determineWinner({player,enemy,timeId});
    }
}

animate();

window.addEventListener("keydown", (event) =>{
    switch(event.key){
        case "d":
            keys.d.pressed = true;
            player.lastkey = "d";
        break;
        case "a":
            keys.a.pressed = true;
            player.lastkey = "a";
        break;
        case "w":
            player.velocity.y = -20;
        break;
        case " ":
            player.attack();
        break;

        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = "ArrowLeft";
        break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastkey = "ArrowRight";
        break;
        case "ArrowUp":
            enemy.velocity.y = -20;
        break;
        case "ArrowDown":
            enemy.attack();
        break;
    }
})

window.addEventListener("keyup", (event) =>{
    switch(event.key){
        case "d":
            keys.d.pressed = false;
        break ;
        case "a":
            keys.a.pressed = false;
        break ;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
        break ;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
        break ;
    }
})