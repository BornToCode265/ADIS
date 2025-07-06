<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/OTPService.php';
require_once __DIR__ . '/../utils/JWTHelper.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../utils/ValidationHelper.php';

class AuthController {
    private $db;
    private $user;
    private $otpService;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->otpService = new OTPService($this->db);
    }

    public function sendOTP() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(empty($data->phone)) {
            ResponseHelper::error("Phone number is required", 400);
            return;
        }

        if(!ValidationHelper::validatePhone($data->phone)) {
            ResponseHelper::error("Invalid phone number format", 400);
            return;
        }

        // Generate and send OTP
        $otp = $this->otpService->generateOTP($data->phone);
        
        if($this->otpService->sendSMS($data->phone, $otp)) {
            ResponseHelper::success("OTP sent successfully");
        } else {
            ResponseHelper::error("Failed to send OTP", 500);
        }
    }

    public function verifyOTP() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(empty($data->phone) || empty($data->otp)) {
            ResponseHelper::error("Phone and OTP are required", 400);
            return;
        }

        if($this->otpService->verifyOTP($data->phone, $data->otp)) {
            // Check if user exists
            if($this->user->findByPhone($data->phone)) {
                $token = JWTHelper::encode([
                    'user_id' => $this->user->id,
                    'phone' => $this->user->phone,
                    'is_admin' => $this->user->is_admin
                ]);

                ResponseHelper::success("Login successful", [
                    'token' => $token,
                    'user' => [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                        'phone' => $this->user->phone,
                        'district' => $this->user->district,
                        'is_admin' => $this->user->is_admin
                    ]
                ]);
            } else {
                ResponseHelper::error("User not found. Please register first.", 404);
            }
        } else {
            ResponseHelper::error("Invalid or expired OTP", 400);
        }
    }

    public function logout() {
        // In a stateless JWT system, logout is handled client-side
        // by removing the token from storage
        ResponseHelper::success("Logged out successfully");
    }

    public function refreshToken() {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';
        
        $user = AuthMiddleware::requireAuth();
        
        $newToken = JWTHelper::encode([
            'user_id' => $user['user_id'],
            'phone' => $user['phone'],
            'is_admin' => $user['is_admin']
        ]);

        ResponseHelper::success("Token refreshed", ['token' => $newToken]);
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(empty($data->username) || empty($data->password)) {
            ResponseHelper::error("Username and password are required", 400);
            return;
        }

        // Authenticate user
        if($this->user->authenticate($data->username, $data->password)) {
            $token = JWTHelper::encode([
                'user_id' => $this->user->id,
                'username' => $this->user->username,
                'phone' => $this->user->phone,
                'is_admin' => $this->user->is_admin
            ]);

            ResponseHelper::success("Login successful", [
                'token' => $token,
                'user' => [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'username' => $this->user->username,
                    'phone' => $this->user->phone,
                    'district' => $this->user->district,
                    'is_admin' => $this->user->is_admin
                ]
            ]);
        } else {
            ResponseHelper::error("Invalid username or password", 401);
        }
    }
}

?>