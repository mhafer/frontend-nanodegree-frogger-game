var allEnemies = []; // stores all enemy objects
var player;

var enemy_values = [60,145,230,315];
var enemy_speeds = [200, 250, 280, 300, 320, 350, 400];



/*
 *      HELPER CLASS
 */

var Helper = function(){}

 // Function returns a random value
Helper.returnRandom = function(values){
    var random = Math.floor(Math.random() * values.length);
    return values[random];
}

/*
 * Function takes two game elements and returns 
 * true if they are in the same block. 
 */ 
Helper.collection = function(token, player){
    
    //get the coordinate of the token
    var tokenCol = Helper.getCol(token);
    var tokenRow = Helper.getRow(token);
    
    //get the coordinate of the player
    var playerCol = Helper.getCol(player);
    var playerRow = Helper.getRow(player);

    //check for match
    if(tokenRow == playerRow && tokenCol == playerCol){
        return true;
    }
}

Helper.getCol = function(position){

    var col = -1;

    if(position.x > 100){
        col = 0;
    } else if (position.x > 200){
        col = 1;
    } else if (position.x > 300){
        col = 2;
    } else if (position.x > 400){
        col = 3;
    } else if (position.x > 500){
        col = 4;
    }
    return col;
}

Helper.getRow = function(position){
    var row = -1;

    if(position.y > 100){
        row = 0;
    } else if (position.y > 200){
        row = 1;
    } else if (position.y > 300){
        row = 2;
    } else if (position.y > 400){
        row = 3;
    } else if (position.y > 500){
        row = 4;
    }
    return row;

}


/*
 *      ENEMY CLASS - our player must avoid
 */

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = Helper.returnRandom(enemy_values);
    this.speed = Helper.returnRandom(enemy_speeds);
    this.width = 101;
    this.height = 171;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // multiple by dt to ensure the game runs at the same speed for all computers.
     this.x = this.x + 101 *dt; // (dt * 300 * Math.random());

    // check for enemy/player collision
    if (this.y == player.y && (this.x > player.x - 68 && this.x < player.x + 68)) {
            //player.reset();
            player.y = 400;
        }
}

// generates a continuous array
// game will generate faster as score increases
Enemy.generateArmy = function() {
    allEnemies.push(new Enemy());
    Enemy.remove();
    var delay = 750;
    // if(score >= 200){
    //     delay = Helper.returnRandom([0, 200, 500, 600, 700]); 
    //  } else if(score >= 100){
    //     delay = Helper.returnRandom([0, 400, 600, 800]); 
    //  } else {
    //     delay = Helper.returnRandom([500, 750, 1000]); 
    //  }
    setTimeout(Enemy.generateArmy, delay);
}

// once the enemy moves off the board it is removed from the array
// clean up enemies
Enemy.remove = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 500){
            allEnemies.splice(index, 1);
        }
    });
}


/*
 *      PLAYER CLASS
 */

var Player = function() {
    this.spritePlayer = "images/char-boy.png";
    this.x = 202;
    this.y = 400;
    this.width = 101;
    this.height = 171;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.spritePlayer), this.x, this.y);
}

// Update the players's position, required method for game
//ensures that the player stays within the canvas x and y range
Player.prototype.update = function(){
    if (this.x < 0) {
        this.x = 0; //protects left bounds
    } else if (this.x > 404) {
        this.x = 404; //protects right bounds
    } else if (this.y === 0) {
        this.y = 400; 
    } else if (this.y < 0) {
        this.y = 400; //reaches the water
    } else if (this.y > 400) {
        this.y = 400; //protects bottom bounds
    }
}

//handles key input and moves player l, r, up, or down
Player.prototype.handleInput = function(key){
      switch (key) {
        case 'left':
            this.x = this.x - 101;
            break;
        case 'up':
            this.y = this.y - 85; 
            break;
        case 'right':
            this.x = this.x + 101;
            break;
        case 'down':
            this.y = this.y + 85;
            break;
    }
}

Player.prototype.reset = function(x, y) {
    this.x = 200;
    this.y = 400;
}

// Instantiate Objects
Enemy.generateArmy();
player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
