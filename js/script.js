var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var flaw = {
    player1: {
        x: 0,
        y: 0,
        color: "red",
        moves: 5
    },
    player2: {
        x: 10,
        y: 10,
        color: "blue"
    },
    renderMap: function () {
        //set size
        canvas.width = window.innerWidth - 100;
        canvas.height = window.innerHeight - 100;


        for (var i = 0; i < canvas.width; i += 15.04) {
            c.moveTo(i, 0);
            c.lineTo(i, canvas.height);
        }

        for (var x = 0; x < canvas.height; x += 15.04) {
            c.moveTo(0, x);
            c.lineTo(canvas.width, x);
        }
        c.stroke();
    },
    renderPlayer: function (player) {
        c.fillStyle = player.color;
        c.fillRect(player.x * 15.04, player.y * 15.04, 15.04, 15.04);
    },
    movePlayer: function (player, dx, dy) {
        if (this.player1.moves == 0) {
            return false;
        }
        if (this.player1 == player) {
            this.player1.x = player.x + dx;
            this.player1.y = player.y + dy;
            this.player1.moves--;
            if (this.player1.moves == 0) {
                $.post( "test.php", { name: "John", time: "2pm" } );
            }
            this.renderGame();
        } else {
            this.player2.x = player.x + dx;
            this.player2.y = player.y + dy;
            this.renderGame();
        }
    },
    renderGame: function () {
        c.clearRect(0, 0, canvas.width, canvas.height);
        this.renderMap();
        this.renderPlayer(this.player1);
        this.renderPlayer(this.player2);
    },
    moveHandler: function () {
        document.onkeydown = function (e) {
            switch (e.which) {
                case 38://Up
                    flaw.movePlayer(flaw.player1, 0, -1);
                    break;
                case 39://right
                    flaw.movePlayer(flaw.player1, 1, 0);
                    break;
                case 40://down
                    flaw.movePlayer(flaw.player1, 0, 1);
                    break;
                case 37://left
                    flaw.movePlayer(flaw.player1, -1, 0);
                    break;
            }
        }
    }
};
flaw.renderMap();
flaw.renderPlayer(flaw.player1);
flaw.renderPlayer(flaw.player2);
flaw.moveHandler();