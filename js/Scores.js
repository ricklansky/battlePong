(function() {
	Pong.Scores = function(game) {
		this.game = game;

		this.left = {score: 0};
		this.right = {score: 0};
		this.winner = 10;
		this.size = 48;
		this.offsets = {
			x: 80,
			y: 10
		};
		this.offsets.rightNumber = this.game.width - this.offsets.x - 0.6375 * this.size;
		this.offsets.rightText = this.game.width - this.offsets.x - 4.25 * this.size;
		this.font = {
			font: this.size + 'px verdana',
			fill: '#666'
		};
	};

	Pong.Scores.prototype = {
		create: function() {
			this.left.text = this.game.add.text(this.offsets.x, this.offsets.y, '0', this.font);
        	this.right.text = this.game.add.text(this.offsets.rightNumber, this.offsets.y, '0', this.font);

        	this._addListenters();
    	},

    	_addListenters: function() {
    		Pong.events.onScore.add(this._score, this);
    	},

    	_score: function(winner) {
    		var winnerObj = this[winner];
    		winnerObj.score += 1;
    		winnerObj.text.setText(winnerObj.score);

    		if (winnerObj.score === this.winner) {
    			winnerObj.text.setText('WINNER');
    			if (winner === 'right') {
	            	winnerObj.text.x = this.offsets.rightText;
            	}
    		} else {
    			Pong.events.onContinueGame.dispatch();
    		}
    	}
	};
})();