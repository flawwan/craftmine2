<?php

class Api
{
	private $db = null;
	private $match;//id
	private $currentPlayer;

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
	 * Hämta andra spelarens spelar id
	 * @return mixed
	 */
	function getOtherPlayerID()
	{
		$sth = $this->db->prepare("SELECT `id` FROM `players` WHERE `player`!=:user AND `match_id`=:match");
		$sth->execute(array(':user' => $this->currentPlayer, ':match' => $this->match));
		return $sth->fetch()["id"];
	}

	/**
	 * Denna metod kallas när spelaren har valt ett alternativ i spelet.
	 */
	function update()
	{
		$dataRecieve = isset($_GET['data']) ? $_GET['data'] : null;
		$player = $this->getCurrentPlayerData();
		if ($dataRecieve == null || $player["turn"] == 0) {
			exit();
		}

//		$oldPosition = explode(":", $player["pos"]);
//		$newPosition = explode(":", $dataRecieve);
//
//		//cheat detection
//		$x = abs($oldPosition[0] - $newPosition[0]);
//		$y = abs($oldPosition[1] - $newPosition[1]);
//
//		if ($x + $y > 10) {
//			exit(); //Cheat
//		}

		//Sätt din data
		$sth = $this->db->prepare("UPDATE `players` SET `data`=:data WHERE `player`=:user AND `match_id`=:match");
		$sth->execute(array(':data' => $dataRecieve, ':user' => $this->currentPlayer, ':match' => $this->match));

		// Meddela att det är andra spelarens tur
		$sth = $this->db->prepare("UPDATE `matches` SET `turn`=:turn WHERE `match_id`=:match_id");
		$sth->execute(array(':turn' => $this->getOtherPlayerID(), ':match_id' => $this->match));
	}

	/**
	 * Hämtar information om dig
	 * @return mixed
	 */
	function getCurrentPlayerData()
	{
		$sth = $this->db->prepare("
		SELECT
		`data`,
		(`turn` = `players`.`id`) as `turn`
		FROM `players`
		LEFT JOIN `matches` ON `matches`.`match_id`=`players`.`match_id`
		WHERE `player`=:user AND `matches`.`match_id`=:match");
		$sth->execute(array(':user' => $this->currentPlayer, ':match' => $this->match));
		return $sth->fetch(PDO::FETCH_ASSOC);
	}

	/**
	 * Hämtar information om andra spelaren
	 * @return mixed
	 */
	function getOtherPlayerData()
	{
		$sth = $this->db->prepare("
		SELECT
		`data`
		FROM `players`
		LEFT JOIN `matches` ON `matches`.`match_id`=`players`.`match_id`
		WHERE `player`!=:user AND `matches`.`match_id`=:match");
		$sth->execute(array(':user' => $this->currentPlayer, ':match' => $this->match));
		return $sth->fetch(PDO::FETCH_ASSOC);
	}

	/**
	 * Metod som kollar om det är din tur samt vilken poäng du och din motståndare har.
	 */
	function ajax()
	{
		header('Content-Type: application/json');
		echo json_encode(array(
			'you' => $this->getCurrentPlayerData(),
			'other' => $this->getOtherPlayerData(),
		));
	}
}