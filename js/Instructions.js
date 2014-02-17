(function() {
	Pong.Instructions = function(game) {
		this.game = game;

		this.size = 36;
		this.lineHeight = 1.3 * this.size;
		this.font = {
			font: this.size + 'px verdana',
			fill: '#666'
		};
	};

	Pong.Instructions.prototype = {
		create: function() {
			this._showInstructions();
			Pong.events.gameAboutToStart.add(this._removeInstructions, this);
		},

		_showInstructions: function() {
			var startHeight = this.game.height/2.0 - 1.5 * this.lineHeight,
	            startLeft = this.game.width - 7.0 * this.size;

	        this.instructions = this.game.add.group();

	        this.instructions.add(this.game.add.text(100, startHeight, 'up: A', this.font));
	        this.instructions.add(this.game.add.text(100, startHeight + this.lineHeight, 'down: Z', this.font));
	        this.instructions.add(this.game.add.text(100, startHeight + 2*this.lineHeight, 'fire: X', this.font));

	        this.instructions.add(this.game.add.text(startLeft, startHeight, 'up: \u2191', this.font));
	        this.instructions.add(this.game.add.text(startLeft, startHeight + this.lineHeight, 'down: \u2193', this.font));
	        this.instructions.add(this.game.add.text(startLeft, startHeight + 2*this.lineHeight, 'fire: \u2190', this.font));

	        this.instructions.add(this.game.add.text(this.game.width/2.0 - this.size * 5, this.game.height * 0.7, 'space bar to pause', this.font));
		},

		_removeInstructions: function() {
			this.instructions.removeAll();
		}
	};
})();