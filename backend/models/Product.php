<?php

class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $product_id;
    public $user_id;
    public $registration_date;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = "INSERT INTO " . $this->table_name . "
                SET product_id=:product_id, user_id=:user_id, status=:status";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getProductsByUserId($user_id) {
        $query = "SELECT p.*, sd.soil_moisture, sd.water_usage_today, sd.temperature, 
                         sd.humidity, sd.system_status, sd.last_watering, sd.next_watering
                  FROM " . $this->table_name . " p
                  LEFT JOIN system_data sd ON p.product_id = sd.product_id
                  WHERE p.user_id = :user_id
                  ORDER BY p.registration_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductData($product_id) {
        $query = "SELECT * FROM system_data 
                  WHERE product_id = :product_id 
                  ORDER BY recorded_at DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateProductStatus($product_id, $status) {
        $query = "UPDATE " . $this->table_name . " SET status=:status WHERE product_id=:product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":product_id", $product_id);
        return $stmt->execute();
    }

    public function getAllProducts() {
        $query = "SELECT p.*, u.name as user_name, u.phone as user_phone
                  FROM " . $this->table_name . " p
                  LEFT JOIN users u ON p.user_id = u.id
                  ORDER BY p.registration_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function productExists($product_id) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE product_id = :product_id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}

?>