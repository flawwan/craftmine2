var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

//set size
canvas.width = 991;
canvas.height = 586;

var flaw = {
    match: 0,
    player1: {
        x: 0,
        y: 0,
        moves: 0,
        color: "red",
        sprite: "player"
    },
    player2: {
        x: 0,
        y: 0,
        color: "blue",
        sprite: "ghost"
    },
    renderMap: function () {

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
    renderApple: function (x, y) {
        c.fillStyle = "red";
        c.fillRect(x * 15, y * 15, 15, 15);
    },
    renderLight: function () {
        //this.renderApple(1,1);
        for (var b = 0; b < canvas.width; b += 15) {
            for (var a = 0; a < canvas.height; a += 15) {
                var d = Math.floor(Math.sqrt(Math.pow(this.player1.x - b / 15, 2) + Math.pow(this.player1.y - a / 15, 2)));
                switch (d) {
                    case 1:
                        c.fillStyle = "rgba(0,0,0,0.2)";
                        c.fillRect(b, a, 15, 15);
                        break;
                    case 2:
                        c.fillStyle = "rgba(0,0,0,0.4)";
                        c.fillRect(b, a, 15, 15);
                        break;
                    case 3:
                        c.fillStyle = "rgba(0,0,0,0.6)";
                        c.fillRect(b, a, 15, 15);
                        break;
                    case 4:
                        c.fillStyle = "rgba(0,0,0,0.8)";
                        c.fillRect(b, a, 15, 15);
                        break;
                    default:
                        c.fillStyle = "rgba(0,0,0,1)";
                        c.fillRect(b, a, 15, 15);
                }
            }
        }
        c.stroke();
    },
//    renderFog: function () {
//        c.fillStyle = "black";
//        for (var b = 0; b < canvas.width; b += 15) {
//            for (var a = 0; a < canvas.height; a += 15) {
//                if (Math.sqrt(Math.pow(this.player1.x - b / 15, 2) + Math.pow(this.player1.y - a / 15, 2)) < 5) {
//                    continue;
//                }
//                c.fillRect(b, a, 15, 15);
//            }
//        }
//
//    },
    renderPlayer: function (player) {
        c.drawImage(document.getElementById(player.sprite), player.x * 15, player.y * 15);
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
            $("#turn").text("Your turn (" + this.player1.moves + ")");
            if (this.player1.moves == 0) {
                $.get("update.php", { id: this.match, data: this.player1.x + ":" + this.player1.y });
                flaw.ajax();
                $("#turn").text("Waiting for your turn");
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
        this.renderPlayer(this.player2);
        //this.renderFog();
        this.renderLight();
        this.renderPlayer(this.player1);

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
                var pos1 = data.you.data.split(":");
                var pos2 = data.other.data.split(":");
                //Uppdatera position bara om det finns en ny uppdatering av positionen
                if (!(flaw.player1.x == parseInt(pos1[0]) && flaw.player1.y == parseInt(pos1[1]) && flaw.player2.x == parseInt(pos2[0]) && flaw.player2.y == parseInt(pos2[1]))) {
                    flaw.player1.x = parseInt(pos1[0]);
                    flaw.player1.y = parseInt(pos1[1]);

                    flaw.player2.x = parseInt(pos2[0]);
                    flaw.player2.y = parseInt(pos2[1]);
                    flaw.renderGame();
                }


                if (data.you.turn == 1) {
                    flaw.player1.moves = 10;
                    $("#turn").text("Your turn (" + flaw.player1.moves + ")");
                    clearInterval(interval);
                } else {
                    $("#turn").text("Waiting for your turn");
                }
            });
        }, 1500);

    }
};

flaw.renderMap();
flaw.moveHandler();