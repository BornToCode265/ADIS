<?php

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $phone;
    public $username;
    public $password_hash;
    public $village;
    public $traditional_authority;
    public $district;
    public $latitude;
    public $longitude;
    public $is_admin;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = "INSERT INTO " . $this->table_name . "
                SET name=:name, phone=:phone, username=:username, password_hash=:password_hash,
                    village=:village, traditional_authority=:traditional_authority,
                    district=:district, latitude=:latitude, longitude=:longitude";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password_hash", $this->password_hash);
        $stmt->bindParam(":village", $this->village);
        $stmt->bindParam(":traditional_authority", $this->traditional_authority);
        $stmt->bindParam(":district", $this->district);
        $stmt->bindParam(":latitude", $this->latitude);
        $stmt->bindParam(":longitude", $this->longitude);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function findByPhone($phone) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE phone = :phone LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":phone", $phone);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->phone = $row['phone'];
            $this->username = $row['username'];
            $this->password_hash = $row['password_hash'];
            $this->village = $row['village'];
            $this->traditional_authority = $row['traditional_authority'];
            $this->district = $row['district'];
            $this->latitude = $row['latitude'];
            $this->longitude = $row['longitude'];
            $this->is_admin = $row['is_admin'];
            return true;
        }
        return false;
    }

    public function updateProfile() {
        $query = "UPDATE " . $this->table_name . "
                SET name=:name, village=:village,
                    traditional_authority=:traditional_authority,
                    district=:district, latitude=:latitude, longitude=:longitude
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":village", $this->village);
        $stmt->bindParam(":traditional_authority", $this->traditional_authority);
        $stmt->bindParam(":district", $this->district);
        $stmt->bindParam(":latitude", $this->latitude);
        $stmt->bindParam(":longitude", $this->longitude);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function getAllUsers() {
        $query = "SELECT id, name, phone, village, traditional_authority, district, 
                         is_admin, created_at FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function findByUsername($username) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->phone = $row['phone'];
            $this->username = $row['username'];
            $this->password_hash = $row['password_hash'];
            $this->village = $row['village'];
            $this->traditional_authority = $row['traditional_authority'];
            $this->district = $row['district'];
            $this->latitude = $row['latitude'];
            $this->longitude = $row['longitude'];
            $this->is_admin = $row['is_admin'];
            return true;
        }
        return false;
    }

    public function authenticate($username, $password) {
        if ($this->findByUsername($username)) {
            require_once __DIR__ . '/../utils/ValidationHelper.php';
            return ValidationHelper::verifyPassword($password, $this->password_hash);
        }
        return false;
    }

    public function usernameExists($username) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}

?>