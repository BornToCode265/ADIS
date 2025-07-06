<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Crop.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../utils/ValidationHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class CropController {
    private $db;
    private $crop;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->crop = new Crop($this->db);
    }

    public function getCrops() {
        $user = AuthMiddleware::requireAuth();
        
        $crops = $this->crop->getCropsByUserId($user['user_id']);
        
        ResponseHelper::success("Crops retrieved successfully", $crops);
    }

    public function createCrop() {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate required fields
        $required_fields = ['crop_name', 'planting_date'];
        $errors = ValidationHelper::validateRequired($data, $required_fields);
        
        if (!empty($errors)) {
            ResponseHelper::error("Validation failed", 400, $errors);
            return;
        }

        // Validate growth stage if provided
        $validStages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'];
        $growth_stage = isset($data->growth_stage) ? $data->growth_stage : 'seedling';
        if (!in_array($growth_stage, $validStages)) {
            ResponseHelper::error("Invalid growth stage", 400);
            return;
        }

        // Validate planting date
        if (!strtotime($data->planting_date)) {
            ResponseHelper::error("Invalid planting date format", 400);
            return;
        }

        $this->crop->user_id = $user['user_id'];
        $this->crop->crop_name = ValidationHelper::sanitizeString($data->crop_name);
        $this->crop->planting_date = $data->planting_date;
        $this->crop->growth_stage = $growth_stage;
        $this->crop->watering_schedule = isset($data->watering_schedule) ? json_encode($data->watering_schedule) : null;

        if($this->crop->create()) {
            ResponseHelper::success("Crop created successfully", [
                'crop_id' => $this->crop->id,
                'crop_name' => $this->crop->crop_name,
                'growth_stage' => $this->crop->growth_stage
            ], 201);
        } else {
            ResponseHelper::error("Failed to create crop", 500);
        }
    }

    public function updateCrop($crop_id) {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        // Get crop to verify ownership
        if (!$this->crop->getCropById($crop_id, $user['user_id'])) {
            ResponseHelper::error("Crop not found or access denied", 404);
            return;
        }

        // Validate growth stage if provided
        if (isset($data->growth_stage)) {
            $validStages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'];
            if (!in_array($data->growth_stage, $validStages)) {
                ResponseHelper::error("Invalid growth stage", 400);
                return;
            }
        }

        // Validate planting date if provided
        if (isset($data->planting_date) && !strtotime($data->planting_date)) {
            ResponseHelper::error("Invalid planting date format", 400);
            return;
        }

        // Update crop properties
        $this->crop->crop_name = isset($data->crop_name) ? ValidationHelper::sanitizeString($data->crop_name) : $this->crop->crop_name;
        $this->crop->planting_date = $data->planting_date ?? $this->crop->planting_date;
        $this->crop->growth_stage = $data->growth_stage ?? $this->crop->growth_stage;
        $this->crop->watering_schedule = isset($data->watering_schedule) ? json_encode($data->watering_schedule) : $this->crop->watering_schedule;

        if($this->crop->update()) {
            ResponseHelper::success("Crop updated successfully");
        } else {
            ResponseHelper::error("Failed to update crop", 500);
        }
    }

    public function deleteCrop($crop_id) {
        $user = AuthMiddleware::requireAuth();
        
        if($this->crop->delete($crop_id, $user['user_id'])) {
            ResponseHelper::success("Crop deleted successfully");
        } else {
            ResponseHelper::error("Failed to delete crop or crop not found", 500);
        }
    }
}

?>