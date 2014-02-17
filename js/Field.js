(function() {
	Pong.Field = function(game) {
		this.game = game;

		this.imgWidth = 1200;
		this.imgHeight = 750;

		this.instructions = new Pong.Instructions(game);
		this.scores = new Pong.Scores(game);
	};

	Pong.Field.prototype = {
		preload: function() {
			this.game.load.image('bg', 'assets/bg.png');
		},

		create: function() {
			var sprite = this.game.add.sprite(0, 0, 'bg');
        	sprite.scale.setTo(this.game.width / this.imgWidth, this.game.height / this.imgHeight);

        	this.walls = this.game.add.group();
        	this._createWall(1);
        	this._createWall(this.game.height - 1);

        	this.instructions.create();
        	this.scores.create();
		},

		update: function() {
			this._checkForPause();
		},

		_checkForPause: function() {
			if (this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
	            this.game.paused = !this.game.paused;
	        }
		},

		_createWall: function(wallLocation) {
			var wall = this.walls.create(this.game.width/2.0, wallLocation);
	        wall.anchor.setTo(0.5, 0.5);
	        wall.renderable = false;
	        wall.height = 1;
	        wall.width = this.game.width;
	        wall.body.immovable = true;
		}
	};
})();