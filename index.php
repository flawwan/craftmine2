<?php
session_start();
$match = intval(isset($_GET['match']) ? $_GET['match'] : 0);
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
<p id="players"></p>
<canvas id="canvas"></canvas>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="js/script.js"></script>
<script>
	var answer = false;
	var interval = setInterval(function () {
		
		$.get("api.php?id=<?=$match;?>", function (data) {
			$("#players").text(data.players.join(" VS "));
			if (data.message.length > 1) {
				alert(data.message);
			}
			if (data.data.turn == "1") {//Om det är din tur
				//Om du har svarat skicka svaret till servern.
				if (answer) {
					$.get("pick.php?id=<?=$match;?>&pick=" + pick, function (data) {
						console.log(data);
					});
				}

			}
		});
	}, 3000);
</script>
</body>
</html>