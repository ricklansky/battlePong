(function() {
    var CONST = new pong.Constants(),
        ballIsInPlay = false,
        game = new Phaser.Game(CONST.width, CONST.height, Phaser.AUTO, '', { preload: preload, create: create, update: update }),
        currentSpeed,
        walls,
        leftPlayer,
        rightPlayer,
        ball,
        instructions,
        sounds = {},
        scores = {left: 0, right: 0},
        fire = {};

    function preload() {
    	game.load.image('bg', 'assets/bg.png');
        game.load.image('paddle', 'assets/paddle.png');
        game.load.image('ball', 'assets/ball.png');

        game.load.spritesheet('flameLeft', 'assets/flameLeft.png', 62, 62);
        game.load.spritesheet('flameRight', 'assets/flameRight.png', 62, 62);

        game.load.audio('fail', ['assets/fail.mp3', 'assets/fail.ogg'], true);
        game.load.audio('wall', ['assets/wall.mp3', 'assets/wall.ogg'], true);
        game.load.audio('paddleSound', ['assets/paddle.mp3', 'assets/paddle.ogg'], true);
        game.load.audio('hit', ['assets/hit.mp3', 'assets/launch.ogg'], true);
        game.load.audio('launch', ['assets/launch.mp3', 'assets/launch.ogg'], true);
    }

    function create() {
        var sprite = game.add.sprite(0, 0, 'bg');
        sprite.scale.setTo(CONST.width / CONST.background.width, CONST.height / CONST.background.height);

        leftPlayer = createPlayer(CONST.paddle.offset, CONST.height/2.0, 'flameLeft');
        rightPlayer = createPlayer(CONST.width - CONST.paddle.offset - CONST.paddle.width, CONST.height/2.0, 'flameRight');

        walls = game.add.group();
        createWall(1);
        createWall(CONST.height - 1);

        createScores();
        createInstructions();

        sounds.fail = game.add.audio('fail');
        sounds.wall = game.add.audio('wall');
        sounds.paddle = game.add.audio('paddleSound');
        sounds.hit = game.add.audio('hit');
        sounds.launch = game.add.audio('launch');

        ball = createBall(true);
    }

    function update() {
    	game.physics.collide(ball, leftPlayer, ballHit, null, this);
        game.physics.collide(ball, rightPlayer, ballHit, null, this);
        game.physics.collide(ball, walls, ballHit, null, this);

        game.physics.overlap(leftPlayer.fire, rightPlayer, fireHit, null, this);
        game.physics.overlap(leftPlayer.fire, rightPlayer.fire, fireHit, null, this);
        game.physics.overlap(rightPlayer.fire, leftPlayer, fireHit, null, this);

        checkForMovement(leftPlayer, Phaser.Keyboard.A, Phaser.Keyboard.Z);
        checkForMovement(rightPlayer, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);

        checkForFiring(leftPlayer, Phaser.Keyboard.X);
        checkForFiring(rightPlayer, Phaser.Keyboard.LEFT);

        checkForPause();
        checkForScore();
    }

    function createPlayer(x, y, fireSprite) {
        var player = game.add.sprite(x, y, 'paddle');

        setPieceParameters(player, 0, true);
        player.fire = null;
        player.fireSprite = fireSprite;

        return player;
    }

    function createFire(x, y, fireSprite, parent) {
        var fire,
            isLeft = fireSprite === 'flameLeft';

        fire = game.add.sprite(x, y, fireSprite);
        fire.anchor.setTo(0.5, 0.5)
        fire.animations.add('fire', isLeft ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0], 16, true);
        fire.outOfBoundsKill = true;
        fire.events.onKilled.add(function(){
            parent.fire = null;
        }, this);

        return fire;
    }

    function createBall(isFirstTime) {
        var ball = game.add.sprite(CONST.width/2.0, CONST.height/2.0, 'ball');

        setPieceParameters(ball, 0.5, false);
        ball.body.collideCallback = ballHit;

        releaseBall(isFirstTime);
        return ball;
    }

    function setPieceParameters(piece, xAnchor, immovable) {
        piece.anchor.setTo(xAnchor, 0.5);
        piece.body.collideWorldBounds = true;
        piece.body.bounce.setTo(1, 1);
        piece.body.immovable = immovable;
    }

    function createWall(wallLocation) {
        var wall = walls.create(CONST.width/2.0, wallLocation);
        wall.anchor.setTo(0.5, 0.5);
        wall.renderable = false;
        wall.height = 1;
        wall.width = CONST.width;
        wall.body.immovable = true;
    }

    function createScores() {
        scores.leftText = game.add.text(CONST.score.offset.x, CONST.score.offset.y, '0', CONST.score.font);
        scores.rightText = game.add.text(CONST.score.offset.rightNumber, CONST.score.offset.y, '0', CONST.score.font);
    }

    function createInstructions() {
        var lineHeight = 1.3 * CONST.score.size ,
            startHeight = CONST.height/2.0 - 1.5*lineHeight,
            startLeft = CONST.width - 7 * CONST.score.size;

        instructions = game.add.group();

        instructions.add(game.add.text(100, startHeight, 'up: A', CONST.score.font));
        instructions.add(game.add.text(100, startHeight + lineHeight, 'down: Z', CONST.score.font));
        instructions.add(game.add.text(100, startHeight + 2*lineHeight, 'fire: X', CONST.score.font));

        instructions.add(game.add.text(startLeft, startHeight, 'up: \u2191', CONST.score.font));
        instructions.add(game.add.text(startLeft, startHeight + lineHeight, 'down: \u2193', CONST.score.font));
        instructions.add(game.add.text(startLeft, startHeight + 2*lineHeight, 'fire: \u2190', CONST.score.font));

        instructions.add(game.add.text(CONST.width/2.0 - CONST.score.size * 5, CONST.height * 0.8, 'space bar to pause', CONST.score.font));
    }

    function releaseBall(isFirstTime) {
        setTimeout(function() {
            ballIsInPlay = true;
            currentSpeed = CONST.ball.speed;

            var vectorSpeed = Math.sqrt(currentSpeed*currentSpeed/2.0);
            ball.body.velocity.x = vectorSpeed * (Math.random() > 0.5 ? 1.0 : -1.0);
            ball.body.velocity.y = vectorSpeed * (Math.random() > 0.5 ? 1.0 : -1.0);
        }, 3000 + (isFirstTime ? 7000 : 0));

        if (isFirstTime) {
            setTimeout(function() {
                instructions.removeAll();
            }, 8000);
        }
    }

    function checkForMovement(player, upKey, downKey) {
        var isVisible = player.x > 0,
            upPressed = game.input.keyboard.isDown(upKey),
            downPressed = game.input.keyboard.isDown(downKey);

        if (isVisible) {
            if (upPressed && !downPressed) {
                player.body.velocity.y = -CONST.paddle.speed;
            } else if (downPressed && !upPressed) {
                player.body.velocity.y = CONST.paddle.speed;
            } else {
                player.body.velocity.y = 0;
            }
        }
    }

    function checkForFiring(player, fireKey) {
        var isVisible = player.x > 0;
        if (game.input.keyboard.justPressed(fireKey) && player.fire === null && isVisible) {
            var isLeft = player === leftPlayer,
                offset = CONST.paddle.offset + CONST.paddle.width + CONST.fire.width / 2.0,
                x = isLeft ? offset : CONST.width - offset;

            player.fire = createFire(x, player.y, player.fireSprite, player);
            player.fire.animations.play('fire');
            player.fire.body.velocity.x = CONST.fire.speed * (isLeft ? 1.0 : -1.0);

            sounds.launch.play();
        }
    }

    function checkForPause() {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            game.paused = !game.paused;
        }
    }

    function checkForScore() {
        // Account for the fact that it takes an iteration for direction changes to occur
        var changingDirection = ball.body.velocity.x * ball.body.deltaX() < 0.0;
        if (changingDirection) {
            ball.body.x = ball.body.preX;
        }

        if(ballIsInPlay && (ball.topLeft.x < CONST.paddle.leftEdge || ball.topRight.x > CONST.paddle.rightEdge)) {
            score();
        }
    }

    function score() {
        if (ball.body.x < CONST.width / 2) {
            scores.right += 1;
        } else {
            scores.left += 1;
        }

        sounds.fail.play();
        ballIsInPlay = false;
        ball.kill();

        if (updateScores()) {
            ball = createBall();
        }
    }

    function updateScores() {
        scores.leftText.setText(scores.left < CONST.score.winner ? scores.left : 'WINNER');
        if (scores.left === CONST.score.winner) {
            return false;
        }

        scores.rightText.setText(scores.right < CONST.score.winner ? scores.right : 'WINNER');
        if (scores.right === CONST.score.winner) {
            scores.rightText.x = CONST.score.offset.rightText;
            return false;
        }

        return true;
    }

    function ballHit(__argCount, ballBody, otherBody) {
        var sprite = otherBody.sprite;
        if (sprite === rightPlayer || sprite === leftPlayer) {
            playerHit(ballBody, sprite);
        } else {
            sounds.wall.play();
        }
    }

    function playerHit(ballBody, player) {
        currentSpeed *= CONST.ball.increase;
        var deltaY = (ballBody.sprite.worldCenterY - player.worldCenterY) / CONST.paddle.height,
            newYSpeed = currentSpeed * (1.7 * deltaY),
            newXDirection = ballBody.velocity.x > 0 ? -1.0 : 1.0;

        sounds.paddle.play();

        ballBody.velocity.y = newYSpeed;
        ballBody.velocity.x = newXDirection * Math.sqrt(currentSpeed * currentSpeed - newYSpeed * newYSpeed);
    }

    function fireHit(fire, hit) {
        sounds.hit.play();
        fire.kill();


        if (hit === leftPlayer || hit === rightPlayer) {
            removePlayer(hit);
        } else {
            hit.kill();
        }
    }

    function removePlayer(player) {
        player.x = -200 - player.x;
        setTimeout(function() {
            player.x = -player.x - 200;
        }, 1000);
    }
})();