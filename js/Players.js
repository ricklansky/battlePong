(function() {
	Pong.Players = function(game) {
		this.game = game;

		this.height 	= 120;
    	this.width		= 18;
    	this.offset 	= 10;
    	this.speed 		= this.game.height / 2.0;

		this.fire = {
			speed: 		this.game.width / 4.0,
			fps: 		16,
			size: 		62
		}
	};

	Pong.Players.prototype = {
		preload: function() {
			this.game.load.image('paddle', 'assets/paddle.png');

			this.game.load.spritesheet('flameLeft', 'assets/flameLeft.png', this.fire.size, this.fire.size);
	        this.game.load.spritesheet('flameRight', 'assets/flameRight.png', this.fire.size, this.fire.size);
		},

		create: function() {
			this.left = this._createPlayer(this.offset, 'flameLeft');
	        this.right = this._createPlayer(this.game.width - this.offset - this.width, 'flameRight');
		},

		update: function() {
			this.game.physics.overlap(this.left.fire, this.right, this._fireHit, null, this);
	        this.game.physics.overlap(this.left.fire, this.right.fire, this._fireHit, null, this);
	        this.game.physics.overlap(this.right.fire, this.left, this._fireHit, null, this);

			this._checkForMovement(this.left, Phaser.Keyboard.A, Phaser.Keyboard.Z);
	        this._checkForMovement(this.right, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);

	        this._checkForFiring(this.left, Phaser.Keyboard.X);
	        this._checkForFiring(this.right, Phaser.Keyboard.LEFT);
		},

		getEdges: function() {
			return {
				left: this.offset + this.width,
				right: this.game.width - this.offset - this.width
			};
		},

		_fireHit: function(fire, hit) {
	        Pong.events.onFireHit.dispatch();
	        fire.kill();

	        if (hit === this.left || hit === this.right) {
	            this._removePlayer(hit);
	        } else {
	            hit.kill();
	        }
	    },

		_removePlayer: function(player) {
			player.x = -200 - player.x;
	        setTimeout(function() {
	            player.x = -player.x - 200;
	        }, 1000);
		},

		_createPlayer: function(x, fireSprite) {
			var player = this.game.add.sprite(x, this.game.height/2.0, 'paddle');

	        player.anchor.setTo(0, 0.5);
	        player.body.collideWorldBounds = true;
	        player.body.bounce.setTo(1, 1);
	        player.body.immovable = true;

	        player.fire = null;
	        player.fireSprite = fireSprite;

	        return player;
		},

		_checkForMovement: function(player, upKey, downKey) {
			var upPressed = this.game.input.keyboard.isDown(upKey),
	            downPressed = this.game.input.keyboard.isDown(downKey);

	        if (player.inWorld) {
	            if (upPressed && !downPressed) {
	                player.body.velocity.y = -this.speed;
	            } else if (downPressed && !upPressed) {
	                player.body.velocity.y = this.speed;
	            } else {
	                player.body.velocity.y = 0;
	            }
	        }
		},

		_checkForFiring: function(player, fireKey) {
	        if (this.game.input.keyboard.justPressed(fireKey) && player.fire === null && player.inWorld) {
	            var isLeft = player === this.left;

	            player.fire = this._createFire(player);

	            Pong.events.onFire.dispatch();
	        }
	    },

	    _createFire: function(player) {
	    	var fire,
	            isLeft = player.fireSprite === 'flameLeft',
	            offset = this.offset + this.width + this.fire.size / 2.0,
	            x = isLeft ? offset : this.game.width - offset;

	        fire = this.game.add.sprite(x, player.y, player.fireSprite);
	        fire.anchor.setTo(0.5, 0.5)
	        fire.animations.add('fire', isLeft ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0], this.fire.fps, true);
	        fire.outOfBoundsKill = true;
	        fire.events.onKilled.add(function() {
	            player.fire = null;
	        }, this);

	        fire.animations.play('fire');
	        fire.body.velocity.x = this.fire.speed * (isLeft ? 1.0 : -1.0);

	        return fire;
	    }
    };
})();