(function() {
	Pong.Sounds = function(game) {
		this.game = game;
	};

	Pong.Sounds.prototype = {
		preload: function() {
			this.game.load.audio('fail', ['assets/fail.mp3', 'assets/fail.ogg'], true);
	        this.game.load.audio('wall', ['assets/wall.mp3', 'assets/wall.ogg'], true);
	        this.game.load.audio('paddleSound', ['assets/paddle.mp3', 'assets/paddle.ogg'], true);
	        this.game.load.audio('hit', ['assets/hit.mp3', 'assets/launch.ogg'], true);
	        this.game.load.audio('launch', ['assets/launch.mp3', 'assets/launch.ogg'], true);
		},

		create: function() {
			this.fail = this.game.add.audio('fail');
	        this.wall = this.game.add.audio('wall');
	        this.paddle = this.game.add.audio('paddleSound');
	        this.hit = this.game.add.audio('hit');
	        this.launch = this.game.add.audio('launch');

	        this._addListeners();
		},

		_play: function(sound) {
			sound.play();
		},

		_addListeners: function() {
			Pong.events.onFireHit.add(function(){ this._play(this.hit); }, this);
			Pong.events.onFire.add(function(){ this._play(this.launch); }, this);
			Pong.events.onWallHit.add(function(){ this._play(this.wall); }, this);
			Pong.events.onPaddleHit.add(function(){ this._play(this.paddle); }, this);
			Pong.events.onScore.add(function(){ this._play(this.fail); }, this);
		}
	};
})();