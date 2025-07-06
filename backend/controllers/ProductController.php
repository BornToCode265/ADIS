<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/SystemData.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../utils/ValidationHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ProductController {
    private $db;
    private $product;
    private $systemData;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->product = new Product($this->db);
        $this->systemData = new SystemData($this->db);
    }

    public function register() {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        if(empty($data->product_id)) {
            ResponseHelper::error("Product ID is required", 400);
            return;
        }

        // Check if product already exists
        if($this->product->productExists($data->product_id)) {
            ResponseHelper::error("Product already registered", 409);
            return;
        }

        $this->product->product_id = ValidationHelper::sanitizeString($data->product_id);
        $this->product->user_id = $user['user_id'];
        $this->product->status = 'active';

        if($this->product->register()) {
            ResponseHelper::success("Product registered successfully", [
                'product_id' => $this->product->product_id,
                'status' => $this->product->status
            ], 201);
        } else {
            ResponseHelper::error("Failed to register product", 500);
        }
    }

    public function getMyProducts() {
        $user = AuthMiddleware::requireAuth();
        
        $products = $this->product->getProductsByUserId($user['user_id']);
        
        ResponseHelper::success("Products retrieved successfully", $products);
    }

    public function getProductData($product_id) {
        $user = AuthMiddleware::requireAuth();
        
        // Verify user owns this product
        $products = $this->product->getProductsByUserId($user['user_id']);
        $userProduct = array_filter($products, function($p) use ($product_id) {
            return $p['product_id'] === $product_id;
        });

        if (empty($userProduct)) {
            ResponseHelper::error("Product not found or access denied", 404);
            return;
        }

        $latestData = $this->systemData->getLatestData($product_id);
        $historicalData = $this->systemData->getHistoricalData($product_id, 7);
        $averageData = $this->systemData->getAverageData($product_id, 30);

        $responseData = [
            'product_info' => reset($userProduct),
            'latest_data' => $latestData,
            'historical_data' => $historicalData,
            'average_data' => $averageData
        ];

        ResponseHelper::success("Product data retrieved successfully", $responseData);
    }

    public function updateProductSettings($product_id) {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        // Verify user owns this product
        $products = $this->product->getProductsByUserId($user['user_id']);
        $userProduct = array_filter($products, function($p) use ($product_id) {
            return $p['product_id'] === $product_id;
        });

        if (empty($userProduct)) {
            ResponseHelper::error("Product not found or access denied", 404);
            return;
        }

        if (isset($data->status)) {
            $validStatuses = ['active', 'inactive', 'maintenance'];
            if (!in_array($data->status, $validStatuses)) {
                ResponseHelper::error("Invalid status", 400);
                return;
            }

            if($this->product->updateProductStatus($product_id, $data->status)) {
                ResponseHelper::success("Product settings updated successfully");
            } else {
                ResponseHelper::error("Failed to update product settings", 500);
            }
        } else {
            ResponseHelper::error("No valid settings provided", 400);
        }
    }

    public function receiveSystemData() {
        // This endpoint would be called by IoT devices to send sensor data
        $data = json_decode(file_get_contents("php://input"));
        
        if(empty($data->product_id)) {
            ResponseHelper::error("Product ID is required", 400);
            return;
        }

        // Verify product exists
        if(!$this->product->productExists($data->product_id)) {
            ResponseHelper::error("Product not found", 404);
            return;
        }

        $this->systemData->product_id = $data->product_id;
        $this->systemData->soil_moisture = $data->soil_moisture ?? null;
        $this->systemData->water_usage_today = $data->water_usage_today ?? null;
        $this->systemData->temperature = $data->temperature ?? null;
        $this->systemData->humidity = $data->humidity ?? null;
        $this->systemData->system_status = $data->system_status ?? 'active';
        $this->systemData->last_watering = $data->last_watering ?? null;
        $this->systemData->next_watering = $data->next_watering ?? null;

        if($this->systemData->create()) {
            ResponseHelper::success("System data recorded successfully");
        } else {
            ResponseHelper::error("Failed to record system data", 500);
        }
    }
}

?>