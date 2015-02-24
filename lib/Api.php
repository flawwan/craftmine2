<?php

class Api
{

	private $msg = "";
	private $status = false;
	private $players = array();
	private $db = null;
	private $match;
	private $pick;
	private $currentPlayer;

	/**
	 * lägger till match id:n och spelarens spelnyckel.
	 * @param $db PDO object
	 */
	function __construct($db)
	{
		$this->db = $db;
		if (!isset($_GET['id']) || !isset($_SESSION['player'])) {
			die("Miss Param");
		}
		$this->match = intval(isset($_GET['id']) ? $_GET['id'] : 0);
		$this->currentPlayer = $_SESSION["player"];
	}

	/**
	 * Denna metod kallas när spelaren har valt ett alternativ i spelet.
	 */
	function pick()
	{
		$this->pick = isset($_GET['pos']) ? $_GET['pos'] : null;
		if ($this->pick == null) {
			exit();
		}

		$player = $this->getCurrentPlayerData();
		if ($player["turn"] == 0) {
			exit(); //Not your turn
		}

		$dbPos = explode(":", $player["pos"]);
		$requestPos = explode(":", $this->pick);

		//cheat detection
		$x = abs($dbPos[0] - $requestPos[0]);
		$y = abs($dbPos[1] - $requestPos[1]);

		if ($x + $y > 5){
			exit(); //Cheat
		}

        //Sätt din position om det är din tur
		$sth = $this->db->prepare("UPDATE `players` SET `pos`=:pos WHERE `player`=:user AND `match_id`=:match");
		$sth->execute(array(':pos' => $this->pick, ':user' => $this->currentPlayer, ':match' => $this->match));

		//Fetch enemy player
		$sth = $this->db->prepare("SELECT `id` FROM `players` WHERE `player`!=:user AND `match_id`=:match");
		$sth->execute(array(':user' => $this->currentPlayer, ':match' => $this->match));

		$turn = $sth->fetch()["id"];
		// set other turn
		$sth = $this->db->prepare("UPDATE `matches` SET `turn`=:turn WHERE `match_id`=:match_id");
		$sth->execute(array(':turn' => $turn, ':match_id' => $this->match));
	}

	function getCurrentPlayerData()
	{
		$sth = $this->db->prepare("
		SELECT
		`pos`,
		(`turn` = `players`.`id`) as `turn`
		FROM `players`
		LEFT JOIN `matches` ON `matches`.`match_id`=`players`.`match_id`
		WHERE `player`=:user AND `matches`.`match_id`=:match");
		$sth->execute(array(':user' => $this->currentPlayer, ':match' => $this->match));
		return $sth->fetch(PDO::FETCH_ASSOC);
	}

	/**
	 * Metod som kollar om det är din tur samt vilken poäng du och din motståndare har.
	 */
	function ajax()
	{
		//Du
		$currentPlayerData = $this->getCurrentPlayerData();

		//Annan spelare
		$sth = $this->db->prepare("
		SELECT
		`pos`,
		(`turn` = `players`.`id`) as `turn`
		FROM `players`
		LEFT JOIN `matches` ON `matches`.`match_id`=`players`.`match_id`
		WHERE `player`!=:user AND `matches`.`match_id`=:match");
		$sth->execute(array(':user' => $this->currentPlayer, ':match' => $this->match));
		$otherPlayerData = $sth->fetch(PDO::FETCH_ASSOC);

		header('Content-Type: application/json');
		$returnData = json_encode(array(
			'data' => $currentPlayerData,
			'other' => $otherPlayerData,
		));

		echo $returnData;
	}
}