<?php
session_start();
$match = intval(isset($_GET['match']) ? $_GET['match'] : 0);
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="css/style.css"/>
</head>
<body>
<p id="players"></p>
<p id="turn"></p>
<canvas id="canvas"></canvas>
<img id="player" src="img/player.png"/>
<img id="ghost" src="img/ghost.png"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="js/script.js"></script>
<script>
	flaw.match = <?=$match;?>;
	flaw.ajax();
</script>
</body>
</html>