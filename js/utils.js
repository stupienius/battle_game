
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