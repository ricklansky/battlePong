(function() {
	Pong.Events = function() {
		this.onFireHit = new Phaser.Signal();
		this.onFire = new Phaser.Signal();
		this.gameAboutToStart = new Phaser.Signal();
		this.onWallHit = new Phaser.Signal();
		this.onPaddleHit = new Phaser.Signal();
		this.onScore = new Phaser.Signal();
		this.onContinueGame = new Phaser.Signal();
	};

	Pong.Events.prototype.destroy = function() {
		this.onFireHit.dispose();
		this.onFire.dispose();
		this.gameAboutToStart.dispose();
		this.onWallHit.dispose();
		this.onPaddleHit.dispose();
		this.onScore.dispose();
		this.onContinueGame.dispose();
	};
})();