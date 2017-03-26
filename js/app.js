var allEnemies = [];
var player;

var playerWins;
var players_time;

var ENEMY_VALUES = [60,145,230,315];
var ENEMY_SPEEDS = [200, 250, 280, 300, 320, 350, 400];

var level = 1;
var score = 0;
var life = 3;

var alert_level_2 = true;
var alert_level_3 = true;

/*
 *      Set up timer
 *      code is derived from https://jsfiddle.net/Daniel_Hug/pvk6p/ 
 *      sets up a simple on screen timer
 */

//retrieve element and set to 00:00:00
var stopwatch = document.getElementsByTagName('h2')[0],
    seconds = 0, 
    minutes = 0, 
    hours = 0,
    t;

//this is called every second, increases by 1 second each time it's called
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    //properly format the time
    stopwatch.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + 
                            (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + 
                            (seconds > 9 ? seconds : "0" + seconds);
    //calls timer (creates a continuous loop --> timer calls add, add calls timer)
    timer();
}

//calls the add() every second
function timer() {
    t = setTimeout(add, 1000);
}

//initial timer call, begins the stopwatch
timer();  


/*
 *      HELPER Object
 *      contains Globally used methods
 */

var helper = {

    // Function returns a random value
    returnRandom : function(values){
        var random = Math.floor(Math.random() * values.length);
        return values[random];
    },
    // Called when score = 300 or lives = 0
    reset : function (){
        //stop the clock
        clearTimeout(t);
        // gets the finished time
        players_time = document.getElementById("timer").innerHTML;        
        //msg depends if boolean playerWins is true or false   
        var msg = (player.win) ?  "Congratulations! You beat the game in just " + players_time + "! <br><br> Would you like to play again and try to beat your time?" : "Oh no! You died. Would you like to play again?";
        // fancy confirmation box via bootbox.js
        bootbox.confirm({
            message: msg,
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {   
                //callback takes the result of the users input (play again or not) and either reloads the page or over writes it      
              if(result){
                location.reload();            
              }else{
                $("#end-game").empty();
                var para = document.createElement("h1");
                var t = document.createTextNode("Thanks for playing");
                para.appendChild(t);
                document.getElementById("end-game").appendChild(para);
              }
            }
        });      
     },
     // This will pop up every time a level is reached
     nextLevel : function (next){
        bootbox.alert({
                message: "Hooray, you're on level " + next + "! Keep Going!",
                size: 'small'
            });
    }
};

/*
 *      ENEMY CLASS - our player must avoid
 */

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;                                      //start off screen and glide in
    this.y = helper.returnRandom(ENEMY_VALUES);         //returns a randon y value
    this.speed = helper.returnRandom(ENEMY_SPEEDS);     //returns a random speed
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // multiple by dt to ensure the game runs at the same speed for all computers.
     this.x = this.x + 75 * dt; // (dt * 300 * Math.random());

    // check for enemy/player collision
    if (this.y == player.y && (this.x > player.x - 68 && this.x < player.x + 68)) player.reset();
};

/*
 * This function generates a continuous array and enemy objects. 
 * The remove() will splice the array once the object is off the canvas.
 * The delay is set depending on the  the score. 
 * The higher the score, the shorter the delay...
 * ...which means more enemies on the canvas at once!
 */
Enemy.generateArmy = function() {
    allEnemies.push(new Enemy(-100,helper.returnRandom(ENEMY_VALUES),'images/enemy-bug.png'));
    Enemy.remove();
    if(score > 200){
        delay = helper.returnRandom([600, 700, 1000]);       
     } else if(score > 100){
        delay = helper.returnRandom([600, 900, 1100, 1500]); 
     } else {
        delay = helper.returnRandom([1000, 2000, 3000]);
     }
    setTimeout(Enemy.generateArmy, delay);
};

// once the enemy moves off the board it is removed from the array
// clean up enemies
Enemy.remove = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 500){
            allEnemies.splice(index, 1);
        }
    });
};


/*
 *      PLAYER CLASS
 */

var Player = function() {
    this.spritePlayer = "images/char-boy.png";
    this.x = 202;
    this.y = 400;
    this.win = false;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.spritePlayer), this.x, this.y);
};

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
        score += 10;
    } else if (this.y > 400) {
        this.y = 400; //protects bottom bounds
    }

    //adjust the level to reflect the score
    //an alert is triggered only one time, when they first reach the next score span
    if(score < 100){
        level = 1;
    } else if (score >= 100 && score < 200){
        level = 2;
        if(alert_level_2) helper.nextLevel(level);                    //once it enters the next level threshhold an display message will trigger once
        alert_level_2 = false;
    } else if (score >= 200 && score < 300){
        level = 3;
        if(alert_level_3) helper.nextLevel(level);                    //once it enters the next level threshhold an display message will trigger once
        alert_level_3 = false;
    } else if (score == 300){
        player.win = true;                              //player has reached the max score
        helper.reset();                                 //alert message is called
    }

    // updates the score HTML
    var players_score = document.getElementById("scoreboard");
    players_score.innerHTML = "Score: " + score;
    // updates the level HTML
    var game_level = document.getElementById("level");
    game_level.innerHTML = "Level: " + level;

};

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
};

Player.prototype.reset = function(x, y) {

    this.x = 202;                                       // reset x value
    this.y = 400;                                       // reset y value
    life--;                                             // decrease life
    var lives = document.getElementById("lifeline");    // update lives HTML
    lives.innerHTML = "Lives: " + life;
    if(life === 0){                                      // check for lose
        helper.reset();                                  // calls reset()
        player.win = true;                               // prevents the game engine from looping again
    }  
};

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
