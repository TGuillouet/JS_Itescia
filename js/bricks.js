let canvas = document.getElementById('canvas');
let context;
let keysDown = {};

/* CLASSES */
class Player {
    constructor(x) {
        this.x = x;
        this.y = 700;
        this.firstHit = false;
    }

    renderPlayer(context) {
        context.fillStyle = 'rgb(200, 0, 0)';
        context.fillRect(this.x - 35, this.y, 70, 20);
    }

    setPlayerListeners() {
        addEventListener('keydown', function (e) {
            keysDown[e.keyCode] = true;
            update();
        });
        addEventListener('keyup', function (e) {
            delete keysDown[e.keyCode];
            update();
        });
    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = { x: 0, y: -1 };
        this.speed = 1;
    }

    setDirection(next) {
        this.direction = { x: next.x * this.speed, y: next.y * this.speed };
    }

    getDirection() {
        return this.direction;
    }

    render() {
        context.fillStyle = 'rgb(200, 0, 0)';
        context.beginPath();
        context.lineWidth = "2";
        context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        context.stroke();
    }
}

class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isTouched = false;
    }

    renderBrick() {
        if (!this.isTouched) {
            context.fillStyle = 'rgb(0, 0, 200)';
        } else {
            context.fillStyle = 'rgb(255, 255, 255)';
        }
        context.fillRect(this.x - 40, this.y, 80, 50);
    }
}
/* END CLASSES */

function init(canvas) {
    if (canvas.getContext) {
        context = canvas.getContext('2d');
    } else {
        console.log('error')
    }
}

function generateLevel(linesNb) {
    let bricks = [];

    let a = Math.floor(canvas.width / 80);

    let currentY = 2;
    for (let u = 0; u < linesNb; u++) {
        let currentX = 45;
        for (let i = 0; i < a; i++) {
            bricks.push(new Brick(currentX, currentY));
            currentX += 81;
        }
        currentY += 52;
    }

    return bricks;
}

function updatePlayer() {
    if (39 in keysDown) {
        if (player.x <= 860) {
            player.x += playerSpeed;
        }
    }
    if (37 in keysDown) {
        if (player.x >= 40) {
            player.x -= playerSpeed;
        }
    }
    player.renderPlayer(context);
}

function checkBallCollisionWithBrick(direction) {
    for (let i = 0; i < bricks.length; i++) {
        if (!bricks[i].isTouched) {
            if (ball.x >= (bricks[i].x - 40) && ball.x <= (bricks[i].x + 40) && ball.y >= (bricks[i].y) && ball.y <= (bricks[i].y + 50)) {
                if (ball.x == (bricks[i].x - 40)) {
                    if (direction.x === ball.speed && direction.y === -ball.speed) {
                        ball.setDirection({ x: -1, y: -1 });
                    } else {
                        ball.setDirection({ x: -1, y: 1 });
                    }
                } else if (ball.x == (bricks[i].x + 40)) {
                    if (direction.x === -ball.speed && direction.y === ball.speed) {
                        ball.setDirection({ x: 1, y: 1 });
                    } else {
                        ball.setDirection({ x: 1, y: -1 });
                    }
                } else if (ball.y == (bricks[i].y)) {
                    if (direction.x === -ball.speed && direction.y === ball.speed) {
                        ball.setDirection({ x: -1, y: -1 });
                    } else {
                        ball.setDirection({ x: 1, y: -1 });
                    }
                } else if (ball.y == (bricks[i].y + 50)) {
                    if (direction.x === ball.speed && direction.y === -ball.speed) {
                        ball.setDirection({ x: 1, y: 1 });
                    } else {
                        ball.setDirection({ x: -1, y: 1 });
                    }
                }
                score += 20;
                nbBricksToBreak -= 1;
                bricks[i].isTouched = true;
                if (nbBricksToBreak === 0) {
                    endMessage('You win ! \n Do you want to retry ?');
                }
            }
        }
        bricks[i].renderBrick();
    }
}

function checkBallCollisionWithPlayer() {
    if (!player.firstHit) {
        ball.direction = { x: 0, y: 1 };
        player.firstHit = true;
    }
    if (ball.y >= player.y && (ball.x >= player.x - 35 && ball.x <= player.x + 35)) {
        if (Math.random() <= 0.5) {
            ball.setDirection({ x: -1, y: -1 });
        } else {
            ball.setDirection({ x: 1, y: -1 });
        }
    }
}

function checkBallCollisionsWithWalls(direction) {
    if (ball.x === 0) {
        if (direction.x === -ball.speed && direction.y === ball.speed) {
            ball.setDirection({ x: 1, y: 1 });
        } else {
            ball.setDirection({ x: 1, y: -1 });
        }
    }
    if (ball.x === canvas.width) {
        if (direction.x === ball.speed && direction.y === ball.speed) {
            ball.setDirection({ x: -1, y: 1 });
        } else {
            ball.setDirection({ x: -1, y: -1 });
        }
    }
    if (ball.y === 0) {
        if (direction.x === ball.speed && direction.y === -ball.speed) {
            ball.setDirection({ x: 1, y: 1 });
        } else {
            ball.setDirection({ x: -1, y: 1 });
        }
    }
    if (ball.y === canvas.height) {
        ball.setDirection({ x: 0, y: 0 });
        endMessage('You loose ! \n Do you want to retry ?');
    }
}

function endMessage(message) {
    if(confirm(message)) {
        location.reload();
    } else {
        clearInterval(updateInterval);
    }
}

function updateBall() {
    // Direction of the ball
    let direction = ball.getDirection();

    // Check all collisions
    checkBallCollisionWithPlayer();
    checkBallCollisionWithBrick(direction);
    checkBallCollisionsWithWalls(direction);

    // Move the ball
    ball.x += ball.direction.x;
    ball.y += ball.direction.y;

    // Render the ball
    ball.render();
}

function updateScore(score) {
    context.font = '15px Arial';
    context.fillText('Score : ' + score, 800, 650);
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Update the player
    updatePlayer();
    // Update the ball
    updateBall();
    // Update score
    updateScore(score);
}

init(canvas);
let player = new Player(450);
let ball = new Ball(450, 600);
let bricks = generateLevel(4);
let nbBricksToBreak = bricks.length;
let score = 0;
let playerSpeed = 3;

player.renderPlayer(context);
player.setPlayerListeners();
ball.render();

let updateInterval = setInterval(update, 5);