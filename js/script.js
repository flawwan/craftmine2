var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var flaw = {
    match: 0,
    player1: {
        x: 0,
        y: 0,
        moves: 0,
        color: "red"
    },
    player2: {
        x: 0,
        y: 0,
        color: "blue"
    },
    renderMap: function () {
        //set size
        canvas.width = 991;
        canvas.height = 586;


        for (var i = 0; i < canvas.width; i += 15) {
            c.moveTo(i, 0);
            c.lineTo(i, canvas.height);
        }

        for (var x = 0; x < canvas.height; x += 15) {
            c.moveTo(0, x);
            c.lineTo(canvas.width, x);
        }
        c.stroke();
    },
    renderPlayer: function (player) {
        c.fillStyle = player.color;
        c.fillRect(player.x * 15, player.y * 15, 15, 15);
    },
    movePlayer: function (player, dx, dy) {
        if (this.player1.moves == 0) {
            return false;
        }

        if (this.player1 == player) {
            //Check collision
            if ((this.player1.x + dx + 1) * 15 >= canvas.width || (this.player1.x + dx) < 0 ||
                (this.player1.y + dy + 1) * 15 >= canvas.height || (this.player1.y + dy) < 0) {
                return false;
            }


            this.player1.x += dx;
            this.player1.y += dy;
            this.player1.moves--;
            if (this.player1.moves == 0) {
                $.get("pick.php", { id: this.match, pos: this.player1.x + ":" + this.player1.y });
                flaw.ajax();
            }
            console.log(this.player1);
            this.renderGame();
        } else {
            this.player2.x += dx;
            this.player2.y += dy;
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
    },
    ajax: function () {
        var interval = setInterval(function () {

            $.get("api.php?id=" + flaw.match, function (data) {
                //Update pos
                var pos1 = data.data.pos.split(":");
                flaw.player1.x = parseInt(pos1[0]);
                flaw.player1.y = parseInt(pos1[1]);

                var pos2 = data.other.pos.split(":");
                flaw.player2.x = parseInt(pos2[0]);
                flaw.player2.y = parseInt(pos2[1]);

                flaw.renderGame();

                if (data.data.turn == 1) {
                    flaw.player1.moves = 5;
                    clearInterval(interval);
                }
            });
        }, 1000);

    }
};

flaw.renderMap();
flaw.moveHandler();