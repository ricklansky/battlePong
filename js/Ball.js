(function() {
	Pong.Ball = function(game, edges) {
		this.game = game;
		this.edges = edges;

		this.gameHasStarted = false;
		this.ballIsInPlay = false;
		this.baseSpeed = this.game.width / 3.0;
		this.increase = 1.05;
		this.currentSpeed = 0;
	};

	Pong.Ball.prototype = {
		preload: function() {
			this.game.load.image('ball', 'assets/ball.png');
		},

		create: function() {
			this._createBall();
			this._addListeners();
		},

		update: function() {
			this.game.physics.collide(this.ball, Pong.players.left, this._ballHit, null, this);
        	this.game.physics.collide(this.ball, Pong.players.right, this._ballHit, null, this);
        	this.game.physics.collide(this.ball, Pong.field.walls, this._ballHit, null, this);

        	this._checkForOutOfBounds();
		},

		_addListeners: function() {
			Pong.events.onContinueGame.add(this._createBall, this);
		},

		_createBall: function() {
			this.ball = this.game.add.sprite(this.game.width/2.0, this.game.height/2.0, 'ball');

	        this.ball.anchor.setTo(0.5, 0.5);
        	this.ball.body.collideWorldBounds = true;
        	this.ball.body.bounce.setTo(1, 1);

	        this.ball.body.collideCallback = this._ballHit;
	        this.ball.body.collideCallbackScope = this;

	        this._releaseBall();
		},

		_releaseBall: function() {
			var self = this;
			setTimeout(function() {
	            self.ballIsInPlay = true;
	            self.currentSpeed = self.baseSpeed;

	            var vectorSpeed = Math.sqrt(self.currentSpeed * self.currentSpeed / 2.0);
	            self.ball.body.velocity.x = vectorSpeed * (Math.random() > 0.5 ? 1.0 : -1.0);
	            self.ball.body.velocity.y = vectorSpeed * (Math.random() > 0.5 ? 1.0 : -1.0);
	            self.gameHasStarted = true;
	        }, 3000 + (this.gameHasStarted ? 0 : 7000));

	        if (!this.gameHasStarted) {
	            setTimeout(function() {
	                Pong.events.gameAboutToStart.dispatch();
	            }, 8000);
	        }
		},

		_ballHit: function(__argCount, ballBody, otherBody) {
			var sprite = otherBody.sprite;
        	if (sprite === Pong.players.left || sprite === Pong.players.right) {
        		//	For some reason scope is being lost here. Sigh.
            	Pong.ball._playerHit(ballBody, sprite, Pong.ball);
        	} else {
            	Pong.events.onWallHit.dispatch();
        	}
		},

		_playerHit: function (ballBody, player, scope) {
	        scope.currentSpeed *= scope.increase;
	        var deltaY = (ballBody.sprite.worldCenterY - player.worldCenterY) / player.height,
	            newYSpeed = scope.currentSpeed * (1.7 * deltaY),
	            newXDirection = ballBody.velocity.x > 0 ? -1.0 : 1.0;

	        ballBody.velocity.y = newYSpeed;
	        ballBody.velocity.x = newXDirection * Math.sqrt(scope.currentSpeed * scope.currentSpeed - newYSpeed * newYSpeed);

	        Pong.events.onPaddleHit.dispatch();
	    },

	    _checkForOutOfBounds: function() {
	    	// Account for the fact that it takes an iteration for direction changes to occur
	        var changingDirection = this.ball.body.velocity.x * this.ball.body.deltaX() < 0.0;
	        if (changingDirection) {
	            this.ball.body.x = this.ball.body.preX;
	        }

	        if(this.ballIsInPlay && (this.ball.topLeft.x < this.edges.left || this.ball.topRight.x > this.edges.right)) {
	            var winner = ((this.ball.body.x < this.game.width / 2) ? 'right' : 'left');
	            this.ballIsInPlay = false;
	            this.ball.kill();
	            Pong.events.onScore.dispatch(winner);
	        }
	    }
	};
})();