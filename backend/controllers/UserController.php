<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../utils/ValidationHelper.php';
require_once __DIR__ . '/../utils/JWTHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class UserController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate required fields
        $required_fields = ['name', 'phone', 'password', 'district'];
        $errors = ValidationHelper::validateRequired($data, $required_fields);
        
        if (!empty($errors)) {
            ResponseHelper::error("Validation failed", 400, $errors);
            return;
        }

        if(!ValidationHelper::validatePhone($data->phone)) {
            ResponseHelper::error("Invalid phone number format", 400);
            return;
        }

        if(!ValidationHelper::validatePassword($data->password)) {
            ResponseHelper::error("Password must be at least 6 characters long", 400);
            return;
        }

        // Check if user already exists
        if($this->user->findByPhone($data->phone)) {
            ResponseHelper::error("User with this phone number already exists", 409);
            return;
        }

        // Generate username
        $username = ValidationHelper::generateUsername($data->name, $data->phone);
        $originalUsername = $username;
        $counter = 1;
        
        // Ensure username is unique
        while($this->user->usernameExists($username)) {
            $username = $originalUsername . $counter;
            $counter++;
        }

        // Validate coordinates if provided
        if (isset($data->latitude) && isset($data->longitude)) {
            if (!ValidationHelper::validateCoordinates($data->latitude, $data->longitude)) {
                ResponseHelper::error("Invalid coordinates", 400);
                return;
            }
        }

        // Set user properties
        $this->user->name = ValidationHelper::sanitizeString($data->name);
        $this->user->phone = $data->phone;
        $this->user->username = $username;
        $this->user->password_hash = ValidationHelper::hashPassword($data->password);
        $this->user->village = isset($data->village) ? ValidationHelper::sanitizeString($data->village) : null;
        $this->user->traditional_authority = isset($data->traditional_authority) ? ValidationHelper::sanitizeString($data->traditional_authority) : null;
        $this->user->district = ValidationHelper::sanitizeString($data->district);
        $this->user->latitude = $data->latitude ?? null;
        $this->user->longitude = $data->longitude ?? null;

        if($this->user->register()) {
            $token = JWTHelper::encode([
                'user_id' => $this->user->id,
                'username' => $this->user->username,
                'phone' => $this->user->phone,
                
                'is_admin' => false
            ]);

            ResponseHelper::success("User registered successfully", [
                'token' => $token,
                'user' => [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'username' => $this->user->username,
                    'phone' => $this->user->phone,
                    'password_hash' => $this->user->password_hash,
                    'district' => $this->user->district,
                    'is_admin' => false
                ]
            ], 201);
        } else {
            ResponseHelper::error("Failed to register user", 500);
        }
    }

    public function getProfile() {
        $user = AuthMiddleware::requireAuth();
        
        $userData = $this->user->getUserById($user['user_id']);
        
        if ($userData) {
            unset($userData['created_at'], $userData['updated_at']);
            ResponseHelper::success("Profile retrieved successfully", $userData);
        } else {
            ResponseHelper::error("User not found", 404);
        }
    }

    public function updateProfile() {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        // Get current user data
        if (!$this->user->getUserById($user['user_id'])) {
            ResponseHelper::error("User not found", 404);
            return;
        }

        // Validate coordinates if provided
        if (isset($data->latitude) && isset($data->longitude)) {
            if (!ValidationHelper::validateCoordinates($data->latitude, $data->longitude)) {
                ResponseHelper::error("Invalid coordinates", 400);
                return;
            }
        }

        // Update user properties
        $this->user->id = $user['user_id'];
        $this->user->name = isset($data->name) ? ValidationHelper::sanitizeString($data->name) : $this->user->name;
        $this->user->village = isset($data->village) ? ValidationHelper::sanitizeString($data->village) : $this->user->village;
        $this->user->traditional_authority = isset($data->traditional_authority) ? ValidationHelper::sanitizeString($data->traditional_authority) : $this->user->traditional_authority;
        $this->user->district = isset($data->district) ? ValidationHelper::sanitizeString($data->district) : $this->user->district;
        $this->user->latitude = $data->latitude ?? $this->user->latitude;
        $this->user->longitude = $data->longitude ?? $this->user->longitude;

        if($this->user->updateProfile()) {
            ResponseHelper::success("Profile updated successfully");
        } else {
            ResponseHelper::error("Failed to update profile", 500);
        }
    }

    public function getDashboardData() {
        $user = AuthMiddleware::requireAuth();
        
        // Get user's products and their data
        require_once __DIR__ . '/../models/Product.php';
        require_once __DIR__ . '/../models/Crop.php';
        
        $product = new Product($this->db);
        $crop = new Crop($this->db);
        
        $products = $product->getProductsByUserId($user['user_id']);
        $crops = $crop->getCropsByUserId($user['user_id']);
        
        $dashboardData = [
            'total_products' => count($products),
            'active_products' => count(array_filter($products, function($p) { return $p['status'] === 'active'; })),
            'total_crops' => count($crops),
            'products' => $products,
            'crops' => $crops
        ];
        
        ResponseHelper::success("Dashboard data retrieved successfully", $dashboardData);
    }
}

?>