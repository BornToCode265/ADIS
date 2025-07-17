<?php

class Database {
    private $host = "localhost";
    private $db_name = "u897516670_chaintechops_d";
    private $username = "u897516670_chaintechops";
    private $password = "T#9vLp2@Km6!Zw1r";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

?>