(function() {
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    Pong.events = new Pong.Events();
    Pong.field = new Pong.Field(game);
    Pong.sounds = new Pong.Sounds(game);
    Pong.players = new Pong.Players(game);
    Pong.ball = new Pong.Ball(game, Pong.players.getEdges());


    function preload() {
    	Pong.field.preload();
        Pong.ball.preload();
        Pong.players.preload();
        Pong.sounds.preload();
    }

    function create() {
        Pong.field.create();
        Pong.players.create();
        Pong.ball.create();
        Pong.sounds.create();
    }

    function update() {
        Pong.ball.update();
        Pong.players.update();
        Pong.field.update();
    }
})();