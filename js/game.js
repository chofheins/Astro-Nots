// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/backgroundspace.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/astronot.png";

var spriteWidth = 40; 
var spriteHeight = 50;

//Asteroid
var asteroidReady = false;
var asteroidImage = new Image();
asteroidImage.onload = function () {
    asteroidReady = true;
};
asteroidImage.src = "images/asteroidSprite.png";

asteroidWidth = 48;
asteroidHeight = 48;

// Sat image
var satPartReady = false;
var satPartImage = new Image();
satPartImage.onload = function () {
	satPartReady = true;
};
satPartImage.src = "images/satellite.png";

//horizontal Laser
var horLaserReady = false;
var horLaserImage = new Image();
horLaserImage.onload = function () {
    horLaserReady = true;
};
horLaserImage.src = "images/horLaser.png"

//Vertical Laser
var vertLaserReady = false;
var vertLaserImage = new Image();
vertLaserImage.onload = function () {
    vertLaserReady = true;
};
vertLaserImage.src = "images/vertLaser.png"

// Game objects
//Score
var initScore = 1000;
var score = 0;
var getScore = setInterval(startScore, 75);
function startScore() {
    initScore--;
}
function stopScore() {
    clearInterval(getScore);
    score = initScore;
}

var hero = {
	speed: 256 // movement in pixels per second
};
var satPart = {};
var satsCaught = 0;

var asteroid = [];
var asteroid0 = {};
asteroid[0] = asteroid0;
var asteroid1 = {};
asteroid[1] = asteroid1;
var asteroid2 = {};
asteroid[2] = asteroid2;
var asteroid3 = {};
asteroid[3]= asteroid3;
var asteroid4 = {};
asteroid[4] = asteroid4;

var horLaser = {};
var vertLaser = {};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a satPart
var reset = function () {
	hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
    
    horLaser.x = canvas.width;
    horLaser.y = 50 + (Math.random() * (canvas.height - 123));

    vertLaser.x = 50 + (Math.random() * (canvas.width - 123));
    vertLaser.y = canvas.height;

	// Throw the satPart somewhere on the screen randomly
	satPart.x = 40 + (Math.random() * (canvas.width - 95));
    satPart.y = 40 + (Math.random() * (canvas.height - 95));
    
    // Add Obstacle
    asteroid0.x = 50 + (Math.random() * (canvas.width - 123));
    asteroid0.y = 50 + (Math.random() * (canvas.height - 123));

    asteroid1.x = 50 + (Math.random() * (canvas.width - 123));
    asteroid1.y = 50 + (Math.random() * (canvas.height - 123));

    asteroid2.x = 50 + (Math.random() * (canvas.width - 123));
    asteroid2.y = 50 + (Math.random() * (canvas.height - 123));

    asteroid3.x = 50 + (Math.random() * (canvas.width - 123));
    asteroid3.y = 50 + (Math.random() * (canvas.height - 123));

    asteroid4.x = 50 + (Math.random() * (canvas.width - 123));
    asteroid4.y = 50 + (Math.random() * (canvas.height - 123));

    //Make sure player never spawns inside an asteroid
    if (
        objectDetection("up", hero.y - 3) == false
        || objectDetection("down", hero.y + 3) == false
        || objectDetection("left", hero.x - 3) == false
        || objectDetection("right", hero.x + 3) == false
    ) {
        reset();
    }

    //Make sure sat never spawns in asteroid
    if (satDetection() == false) {
        reset();
    }
};

// Update game objects
var update = function (modifier) {
    ctx.clearRect(hero.x, hero.y,spriteWidth,spriteHeight);

    

	if (38 in keysDown && hero.y > 25 && objectDetection("up", hero.y - 3)) { // Player holding up 
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y < 455-50 && objectDetection("down", hero.y + 3)) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x > 25 && objectDetection("left", hero.x - 3)) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x < 487-40 && objectDetection("right", hero.x + 3)) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (satPart.x + 30)
		&& satPart.x <= (hero.x + 40)
		&& hero.y <= (satPart.y + 27)
		&& satPart.y <= (hero.y + 50)
	) {
		++satsCaught;
		reset();
    }
    
    if (
		hero.x <= (horLaser.x + 70)
		&& horLaser.x <= (hero.x + 40)
		&& hero.y <= (horLaser.y + 7)
		&& horLaser.y <= (hero.y + 50)
	) {
        if (satsCaught > 0) {
            --satsCaught;
        }
		reset();
    }
    
    if (
		hero.x <= (vertLaser.x + 7)
		&& vertLaser.x <= (hero.x + 40)
		&& hero.y <= (vertLaser.y + 70)
		&& vertLaser.y <= (hero.y + 50)
	) {
        if (satsCaught > 0) {
            --satsCaught;
        }
		reset();
    }
    
    if (satsCaught == 8) {
        stopScore();
        window.stop();
    }
};

//pos is needed beecause the game has some weird rounding errors between the sizes of the objects and their positions
function objectDetection(direction, pos) {
    for (i = 0; i < 5; i++) {
        if (
            direction == "up"
            && pos < (asteroid[i].y + asteroidHeight)
            && hero.x < (asteroid[i].x + asteroidWidth)
            && asteroid[i].x < (hero.x + 40)
            && (pos + 50) > asteroid[i].y
        ) {
            return false;
        }
        else if (
            direction == "down"
            && hero.x < (asteroid[i].x + asteroidWidth)
            && asteroid[i].x < (hero.x + 40)
            && asteroid[i].y < (pos + 50)
            && (asteroid[i].y + asteroidHeight) > pos
        ) {
            return false;
        }
        else if (
            direction == "left"
            && hero.y < (asteroid[i].y + asteroidHeight)
            && asteroid[i].y < (hero.y + 50)
            && pos < (asteroid[i].x + asteroidWidth)
            && (pos + 40) > asteroid[i].x
        ) {
            return false;
        }
        else if (
            direction == "right"
            && hero.y < (asteroid[i].y + asteroidHeight)
            && asteroid[i].y < (hero.y + 50)
            && asteroid[i].x < (pos + 40)
            && (asteroid[i].x + asteroidHeight) > pos
        ) {
            return false;
        }
    }
    return true;
};

function satDetection() {
    for (i = 0; i < 5; i++) {
        if (
            asteroid[i].x <= (satPart.x + 30)
            && satPart.x <= (asteroid[i].x + asteroidWidth)
            && asteroid[i].y <= (satPart.y + 27)
            && satPart.y <= (asteroid[i].y + asteroidHeight)
        ) {
            return false;
        }
    }
    return true;
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (satPartReady) {
		ctx.drawImage(satPartImage, satPart.x, satPart.y);
    }
    
    if (asteroidReady) {
        ctx.drawImage(asteroidImage, asteroid0.x, asteroid0.y);
        ctx.drawImage(asteroidImage, asteroid1.x, asteroid1.y);
        ctx.drawImage(asteroidImage, asteroid2.x, asteroid2.y);
        ctx.drawImage(asteroidImage, asteroid3.x, asteroid3.y);
        ctx.drawImage(asteroidImage, asteroid4.x, asteroid4.y);
    }
    
    if (horLaserReady) {
        ctx.drawImage(horLaserImage, horLaser.x, horLaser.y);
        horLaser.x -= 3;
        if (horLaser.x > canvas.width) requestAnimationFrame(render);
    }

    if (vertLaserReady) {
        ctx.drawImage(vertLaserImage, vertLaser.x, vertLaser.y);
        vertLaser.y -= 3;
        if (vertLaser.x > canvas.height) requestAnimationFrame(render);
    }

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    ctx.fillText("satellites retrieved: " + satsCaught, 32, 32);
    ctx.fillText("score: " + score, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

    then = now;
    
    if(score == 0) {
        requestAnimationFrame(main);
    }

};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
