<?php

class SystemData {
    private $conn;
    private $table_name = "system_data";

    public $id;
    public $product_id;
    public $soil_moisture;
    public $water_usage_today;
    public $temperature;
    public $humidity;
    public $system_status;
    public $last_watering;
    public $next_watering;
    public $recorded_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET product_id=:product_id, soil_moisture=:soil_moisture,
                    water_usage_today=:water_usage_today, temperature=:temperature,
                    humidity=:humidity, system_status=:system_status,
                    last_watering=:last_watering, next_watering=:next_watering";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":soil_moisture", $this->soil_moisture);
        $stmt->bindParam(":water_usage_today", $this->water_usage_today);
        $stmt->bindParam(":temperature", $this->temperature);
        $stmt->bindParam(":humidity", $this->humidity);
        $stmt->bindParam(":system_status", $this->system_status);
        $stmt->bindParam(":last_watering", $this->last_watering);
        $stmt->bindParam(":next_watering", $this->next_watering);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getLatestData($product_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE product_id = :product_id
                  ORDER BY recorded_at DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getHistoricalData($product_id, $days = 7) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE product_id = :product_id
                  AND recorded_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                  ORDER BY recorded_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":days", $days);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateSystemStatus($product_id, $status) {
        $query = "UPDATE " . $this->table_name . "
                  SET system_status=:status
                  WHERE product_id=:product_id
                  ORDER BY recorded_at DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":product_id", $product_id);

        return $stmt->execute();
    }

    public function getAverageData($product_id, $days = 30) {
        $query = "SELECT 
                    AVG(soil_moisture) as avg_soil_moisture,
                    AVG(temperature) as avg_temperature,
                    AVG(humidity) as avg_humidity,
                    SUM(water_usage_today) as total_water_usage
                  FROM " . $this->table_name . "
                  WHERE product_id = :product_id
                  AND recorded_at >= DATE_SUB(NOW(), INTERVAL :days DAY)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":days", $days);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>