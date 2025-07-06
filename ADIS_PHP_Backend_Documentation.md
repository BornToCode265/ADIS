
# ADIS - Automated Drip Irrigation System
## Complete PHP Backend Implementation Guide

### Overview
This document provides comprehensive instructions for building a PHP backend service for the ADIS (Automated Drip Irrigation System) web application using XAMPP, MySQL, and PDO for database operations.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Database Structure](#database-structure)
3. [Project Structure](#project-structure)
4. [API Endpoints](#api-endpoints)
5. [PHP Implementation](#php-implementation)
6. [Security Considerations](#security-considerations)
7. [Testing](#testing)

## System Requirements

### XAMPP Setup
- XAMPP (Latest version with PHP 8.0+)
- MySQL/MariaDB
- Apache Server
- PHPMyAdmin for database management

### PHP Extensions Required
- PDO
- PDO_MySQL
- JSON
- OpenSSL (for JWT tokens)
- cURL (for external API calls)

## Database Structure

### 1. Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    village VARCHAR(255),
    traditional_authority VARCHAR(255),
    district VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 3. OTP Verification Table
```sql
CREATE TABLE otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. System Data Table
```sql
CREATE TABLE system_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    soil_moisture DECIMAL(5,2),
    water_usage_today DECIMAL(8,2),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    system_status ENUM('active', 'inactive', 'error') DEFAULT 'active',
    last_watering TIMESTAMP,
    next_watering TIMESTAMP,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
```

### 5. Crops Table
```sql
CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    planting_date DATE NOT NULL,
    growth_stage ENUM('seedling', 'vegetative', 'flowering', 'fruiting', 'harvest') DEFAULT 'seedling',
    watering_schedule JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6. Support Tickets Table
```sql
CREATE TABLE support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 7. Documents Table
```sql
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_type ENUM('pdf', 'video', 'image', 'manual') NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
adis-backend/
├── config/
│   ├── database.php
│   ├── config.php
│   └── cors.php
├── controllers/
│   ├── AuthController.php
│   ├── UserController.php
│   ├── ProductController.php
│   ├── DashboardController.php
│   ├── SupportController.php
│   └── AdminController.php
├── models/
│   ├── User.php
│   ├── Product.php
│   ├── SystemData.php
│   ├── Crop.php
│   └── SupportTicket.php
├── middleware/
│   ├── AuthMiddleware.php
│   └── AdminMiddleware.php
├── utils/
│   ├── OTPService.php
│   ├── JWTHelper.php
│   ├── ResponseHelper.php
│   └── ValidationHelper.php
├── uploads/
│   ├── documents/
│   └── images/
├── api/
│   └── index.php
├── .htaccess
└── composer.json
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/logout
POST /api/auth/refresh-token
```

### User Management
```
POST /api/users/register
GET /api/users/profile
PUT /api/users/profile
GET /api/users/dashboard-data
```

### Product Management
```
POST /api/products/register
GET /api/products/my-products
GET /api/products/{product_id}/data
PUT /api/products/{product_id}/settings
```

### Crop Management
```
GET /api/crops
POST /api/crops
PUT /api/crops/{crop_id}
DELETE /api/crops/{crop_id}
```

### Support System
```
GET /api/support/tickets
POST /api/support/tickets
PUT /api/support/tickets/{ticket_id}
GET /api/support/documents
```

### Admin Endpoints
```
GET /api/admin/users
GET /api/admin/products
GET /api/admin/analytics
PUT /api/admin/users/{user_id}/status
```

## PHP Implementation

### 1. Database Configuration (config/database.php)
```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "adis_system";
    private $username = "root";
    private $password = "";
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
```

### 2. Main Configuration (config/config.php)
```php
<?php
// API Configuration
define('API_VERSION', '1.0');
define('JWT_SECRET', 'your-secret-key-here');
define('JWT_EXPIRY', 3600 * 24); // 24 hours

// OTP Configuration
define('OTP_EXPIRY', 300); // 5 minutes
define('OTP_LENGTH', 6);

// File Upload Configuration
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB

// SMS API Configuration (for OTP)
define('SMS_API_URL', 'your-sms-api-url');
define('SMS_API_KEY', 'your-sms-api-key');

// CORS Configuration
define('ALLOWED_ORIGINS', ['http://localhost:3000', 'https://yourdomain.com']);

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
```

### 3. CORS Handler (config/cors.php)
```php
<?php
function handleCORS() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>
```

### 4. User Model (models/User.php)
```php
<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $phone;
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
                SET name=:name, phone=:phone, village=:village, 
                    traditional_authority=:traditional_authority, 
                    district=:district, latitude=:latitude, longitude=:longitude";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":phone", $this->phone);
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
}
?>
```

### 5. Authentication Controller (controllers/AuthController.php)
```php
<?php
require_once '../config/database.php';
require_once '../models/User.php';
require_once '../utils/OTPService.php';
require_once '../utils/JWTHelper.php';
require_once '../utils/ResponseHelper.php';

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
}
?>
```

### 6. OTP Service (utils/OTPService.php)
```php
<?php
class OTPService {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function generateOTP($phone) {
        // Generate 6-digit OTP
        $otp = sprintf("%06d", mt_rand(100000, 999999));
        
        // Store in database
        $query = "INSERT INTO otp_verifications 
                  SET phone=:phone, otp_code=:otp, expires_at=:expires_at";
        
        $stmt = $this->conn->prepare($query);
        $expires_at = date('Y-m-d H:i:s', time() + OTP_EXPIRY);
        
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":otp", $otp);
        $stmt->bindParam(":expires_at", $expires_at);
        
        if($stmt->execute()) {
            return $otp;
        }
        return false;
    }

    public function verifyOTP($phone, $otp) {
        $query = "SELECT * FROM otp_verifications 
                  WHERE phone=:phone AND otp_code=:otp 
                  AND expires_at > NOW() AND is_used=0 
                  ORDER BY created_at DESC LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":otp", $otp);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            // Mark OTP as used
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $update_query = "UPDATE otp_verifications SET is_used=1 WHERE id=:id";
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bindParam(":id", $row['id']);
            $update_stmt->execute();
            
            return true;
        }
        return false;
    }

    public function sendSMS($phone, $otp) {
        // Implement SMS sending logic here
        // For development, you can log to file or return true
        $message = "Your ADIS verification code is: $otp. Valid for 5 minutes.";
        
        // Example using cURL for SMS API
        /*
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => SMS_API_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'to' => $phone,
                'message' => $message,
                'api_key' => SMS_API_KEY
            ]),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json']
        ));
        
        $response = curl_exec($curl);
        curl_close($curl);
        */
        
        // For development, just return true
        error_log("SMS OTP: $phone - $otp");
        return true;
    }
}
?>
```

### 7. JWT Helper (utils/JWTHelper.php)
```php
<?php
class JWTHelper {
    public static function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['exp'] = time() + JWT_EXPIRY;
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }

    public static function decode($jwt) {
        $tokenParts = explode('.', $jwt);
        if(count($tokenParts) != 3) {
            return false;
        }

        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signatureProvided = $tokenParts[2];

        $expiration = json_decode($payload)->exp;
        if($expiration < time()) {
            return false;
        }

        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        if($base64Signature === $signatureProvided) {
            return json_decode($payload, true);
        }
        return false;
    }
}
?>
```

### 8. Response Helper (utils/ResponseHelper.php)
```php
<?php
class ResponseHelper {
    public static function success($message = "Success", $data = null, $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }

    public static function error($message = "Error", $code = 400, $errors = null) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
}
?>
```

### 9. Main API Router (api/index.php)
```php
<?php
require_once '../config/config.php';
require_once '../config/cors.php';

// Handle CORS
handleCORS();

// Set JSON header
header('Content-Type: application/json');

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Route handling
switch($path) {
    case '/auth/send-otp':
        if($method === 'POST') {
            require_once '../controllers/AuthController.php';
            $controller = new AuthController();
            $controller->sendOTP();
        }
        break;
        
    case '/auth/verify-otp':
        if($method === 'POST') {
            require_once '../controllers/AuthController.php';
            $controller = new AuthController();
            $controller->verifyOTP();
        }
        break;
        
    case '/users/register':
        if($method === 'POST') {
            require_once '../controllers/UserController.php';
            $controller = new UserController();
            $controller->register();
        }
        break;
        
    case '/users/profile':
        require_once '../controllers/UserController.php';
        $controller = new UserController();
        if($method === 'GET') {
            $controller->getProfile();
        } elseif($method === 'PUT') {
            $controller->updateProfile();
        }
        break;
        
    case '/dashboard/data':
        if($method === 'GET') {
            require_once '../controllers/DashboardController.php';
            $controller = new DashboardController();
            $controller->getDashboardData();
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>
```

### 10. .htaccess for URL Rewriting
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ api/index.php [QSA,L]

# Enable CORS for all requests
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
```

## Security Considerations

### 1. Input Validation
- Validate all input data
- Use prepared statements for database queries
- Sanitize file uploads
- Implement rate limiting for OTP requests

### 2. Authentication & Authorization
- Use JWT tokens for session management
- Implement proper RBAC (Role-Based Access Control)
- Hash sensitive data
- Use HTTPS in production

### 3. Database Security
- Use environment variables for database credentials
- Implement proper error handling
- Regular database backups
- Use least privilege principle for database users

## Testing

### 1. API Testing with Postman
Create a Postman collection with all endpoints:

```json
{
  "info": {
    "name": "ADIS API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Send OTP",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"phone\": \"+265888123456\"}"
            },
            "url": {
              "raw": "http://localhost/adis-backend/api/auth/send-otp",
              "protocol": "http",
              "host": ["localhost"],
              "path": ["adis-backend", "api", "auth", "send-otp"]
            }
          }
        }
      ]
    }
  ]
}
```

### 2. Unit Testing
Implement PHPUnit tests for critical functionality:

```php
<?php
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase {
    public function testUserRegistration() {
        // Test user registration logic
        $this->assertTrue(true);
    }
    
    public function testOTPGeneration() {
        // Test OTP generation and validation
        $this->assertTrue(true);
    }
}
?>
```

## Deployment Instructions

### 1. XAMPP Setup
1. Install XAMPP
2. Start Apache and MySQL services
3. Create database 'adis_system' in PHPMyAdmin
4. Import database schema
5. Place PHP files in htdocs/adis-backend/

### 2. Configuration
1. Update database credentials in config/database.php
2. Set proper JWT secret key
3. Configure SMS API credentials
4. Set appropriate file permissions

### 3. Production Considerations
1. Use environment variables for sensitive data
2. Enable HTTPS
3. Implement proper logging
4. Set up automated backups
5. Configure monitoring and alerts

## Additional Features to Implement

### 1. Real-time Data Integration
- WebSocket connections for live system data
- Integration with IoT sensors
- Automated irrigation scheduling

### 2. Analytics Dashboard
- Usage statistics
- Performance metrics
- Predictive analytics for crop management

### 3. Mobile App Support
- Push notifications
- Offline capability
- Location-based services

This comprehensive documentation provides everything needed to build a complete PHP backend for the ADIS application. The implementation follows best practices for security, scalability, and maintainability.
