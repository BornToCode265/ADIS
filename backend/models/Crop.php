<?php

class Crop {
    private $conn;
    private $table_name = "crops";

    public $id;
    public $user_id;
    public $crop_name;
    public $planting_date;
    public $growth_stage;
    public $watering_schedule;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET user_id=:user_id, crop_name=:crop_name,
                    planting_date=:planting_date, growth_stage=:growth_stage,
                    watering_schedule=:watering_schedule";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":crop_name", $this->crop_name);
        $stmt->bindParam(":planting_date", $this->planting_date);
        $stmt->bindParam(":growth_stage", $this->growth_stage);
        $stmt->bindParam(":watering_schedule", $this->watering_schedule);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getCropsByUserId($user_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE user_id = :user_id
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET crop_name=:crop_name, planting_date=:planting_date,
                    growth_stage=:growth_stage, watering_schedule=:watering_schedule
                WHERE id=:id AND user_id=:user_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":crop_name", $this->crop_name);
        $stmt->bindParam(":planting_date", $this->planting_date);
        $stmt->bindParam(":growth_stage", $this->growth_stage);
        $stmt->bindParam(":watering_schedule", $this->watering_schedule);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    public function delete($id, $user_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id AND user_id=:user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":user_id", $user_id);
        return $stmt->execute();
    }

    public function getCropById($id, $user_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE id = :id AND user_id = :user_id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->user_id = $row['user_id'];
            $this->crop_name = $row['crop_name'];
            $this->planting_date = $row['planting_date'];
            $this->growth_stage = $row['growth_stage'];
            $this->watering_schedule = $row['watering_schedule'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }
}

?>