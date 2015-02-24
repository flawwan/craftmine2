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
	flaw.match = <?=$match;?>;
	flaw.ajax();
</script>
</body>
</html>