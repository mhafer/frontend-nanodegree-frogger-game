var allEnemies = []; // stores all enemy objects
var player;


// The Helper class. Contains methods used for general actions throughout the game
// that are not specific to any one object.
var Helper = function(){}
 // Function returns a random value
Helper.returnRandom = function(values){
    var random = Math.floor(Math.random() * values.length);
    return values[random];
}
/*
 * Function checks whether two elements on the canvas overlap or touch.
 * Takes in two figures as parameters and returns a boolean. The word player
 * is used for clarity only; any figures can be parameters.
 */
Helper.collision = function(fig1, player){
    //return ((fig1.x == player.x) && (fig1.y == player.y));
}

/*
 * Function takes two game elements and returns 
 * true if they are in the same block. Used for gem collisions, 
 * since an exact overlap is not required. The player 
 * just needs to be on the same block as the gem.
 */ 
Helper.collection = function(fig1, player){
    // var fig1Row = Helper.getRow(fig1);
    // var fig1Col = Helper.getCol(fig1);
    // var playerRow = Helper.getRow(player);
    // var playerCol = Helper.getCol(player);
    // if(fig1Row == playerRow && fig1Col == playerCol){
    //     return true;
    // }
}

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = Helper.returnRandom([72,154,236,318]);
    this.speed = Helper.returnRandom([200, 250, 280, 300, 320, 350, 400]);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // this.x += this.speed * dt;
     this.x = this.x + (dt * 300 * Math.random());
     allEnemies.forEach(function(enemy, index) {
        if(Helper.collision(enemy, player)){
            player.y = 400;
        }
    });


     /*
         if (this.x > maxPos) {
        this.reset();
        */
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.reset = function() {
    this.x = 0;
    this.y = Helper.returnRandom([50,135,220,305]);
    this.speed = Helper.returnRandom([200, 250, 280, 300, 320, 350, 400]);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.spritePlayer = "images/char-boy.png";
    this.x = 200;
    this.y = 400;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.spritePlayer), this.x, this.y);
}

// Update the players's position, required method for game
//ensures that the player stays within the canvas x and y range
Player.prototype.update = function(){
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > 400) {
        this.x = 400;
    } else if (this.y === 0) {
        this.y = 400;
    } else if (this.y < 0) {
        this.y = 400;
    } else if (this.y > 400) {
        this.y = 400;
    }
}

//handles key input and moves player l, r, up, or down
Player.prototype.handleInput = function(key){
      switch (key) {
        case 'left':
            this.x = this.x - 100;
            break;
        case 'up':
            this.y = this.y - 82;  //adjusted to fit image size
            break;
        case 'right':
            this.x = this.x + 100;
            break;
        case 'down':
            this.y = this.y + 82;
            break;
    }
}

Player.prototype.reset = function(x, y) {
    this.x = 200;
    this.y = 400;
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [
  new Enemy(),
  new Enemy(),
  new Enemy()
];
player = new Player();
//var prize = new Prize();
//var start = new Start();

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
