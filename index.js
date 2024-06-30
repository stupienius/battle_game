const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0 ,0 , canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:"./img/background.png"
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/kenji/idle.png'  // Update this path
});


const enemy = new Fighter({
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


decreaseTimer();

function animate(){
    console.log(player.jumpTime);
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
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
            if(player.jumpTime < 2){
                player.velocity.y = -20;
                player.jumpTime ++;
            }
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
            if(enemy.jumpTime < 2){
                enemy.velocity.y = -20;
                enemy.jumpTime ++;
            }
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