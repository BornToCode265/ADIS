<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/SupportTicket.php';
require_once __DIR__ . '/../models/SystemData.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../middleware/AdminMiddleware.php';

class AdminController {
    private $db;
    private $user;
    private $product;
    private $supportTicket;
    private $systemData;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->product = new Product($this->db);
        $this->supportTicket = new SupportTicket($this->db);
        $this->systemData = new SystemData($this->db);
    }

    public function getUsers() {
        AdminMiddleware::requireAdmin();
        
        $users = $this->user->getAllUsers();
        
        ResponseHelper::success("Users retrieved successfully", $users);
    }

    public function getProducts() {
        AdminMiddleware::requireAdmin();
        
        $products = $this->product->getAllProducts();
        
        ResponseHelper::success("Products retrieved successfully", $products);
    }

    public function getAnalytics() {
        AdminMiddleware::requireAdmin();
        
        // Get overall system statistics
        $userStats = $this->getUserStats();
        $productStats = $this->getProductStats();
        $ticketStats = $this->supportTicket->getTicketStats();
        $systemStats = $this->getSystemStats();
        
        $analytics = [
            'users' => $userStats,
            'products' => $productStats,
            'tickets' => $ticketStats,
            'system' => $systemStats,
            'recent_activity' => $this->getRecentActivity()
        ];
        
        ResponseHelper::success("Analytics retrieved successfully", $analytics);
    }

    public function updateUserStatus($user_id) {
        AdminMiddleware::requireAdmin();
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->is_admin)) {
            ResponseHelper::error("Admin status is required", 400);
            return;
        }

        $query = "UPDATE users SET is_admin=:is_admin WHERE id=:user_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":is_admin", $data->is_admin, PDO::PARAM_BOOL);
        $stmt->bindParam(":user_id", $user_id);

        if ($stmt->execute()) {
            ResponseHelper::success("User status updated successfully");
        } else {
            ResponseHelper::error("Failed to update user status", 500);
        }
    }

    public function getAllTickets() {
        AdminMiddleware::requireAdmin();
        
        $tickets = $this->supportTicket->getAllTickets();
        
        ResponseHelper::success("All tickets retrieved successfully", $tickets);
    }

    public function updateTicketStatus($ticket_id) {
        AdminMiddleware::requireAdmin();
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->status)) {
            ResponseHelper::error("Status is required", 400);
            return;
        }

        $validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!in_array($data->status, $validStatuses)) {
            ResponseHelper::error("Invalid status", 400);
            return;
        }

        if ($this->supportTicket->updateStatus($ticket_id, $data->status)) {
            ResponseHelper::success("Ticket status updated successfully");
        } else {
            ResponseHelper::error("Failed to update ticket status", 500);
        }
    }

    public function getSystemOverview() {
        AdminMiddleware::requireAdmin();
        
        $overview = [
            'total_users' => $this->getTotalCount('users'),
            'total_products' => $this->getTotalCount('products'),
            'active_products' => $this->getActiveProductsCount(),
            'total_tickets' => $this->getTotalCount('support_tickets'),
            'open_tickets' => $this->getOpenTicketsCount(),
            'recent_registrations' => $this->getRecentRegistrations(),
            'system_health' => $this->getSystemHealth()
        ];
        
        ResponseHelper::success("System overview retrieved successfully", $overview);
    }

    private function getUserStats() {
        $query = "SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN is_admin = 1 THEN 1 ELSE 0 END) as admin_users,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users_30_days,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_users_7_days
                  FROM users";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function getProductStats() {
        $query = "SELECT 
                    COUNT(*) as total_products,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_products,
                    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_products,
                    SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_products,
                    SUM(CASE WHEN registration_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_products_30_days
                  FROM products";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function getSystemStats() {
        $query = "SELECT 
                    AVG(soil_moisture) as avg_soil_moisture,
                    AVG(temperature) as avg_temperature,
                    AVG(humidity) as avg_humidity,
                    SUM(water_usage_today) as total_water_usage,
                    COUNT(DISTINCT product_id) as active_systems
                  FROM system_data 
                  WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function getRecentActivity() {
        $activities = [];
        
        // Recent user registrations
        $query = "SELECT 'user_registration' as type, name as description, created_at as timestamp 
                  FROM users 
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                  ORDER BY created_at DESC LIMIT 5";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $activities = array_merge($activities, $stmt->fetchAll(PDO::FETCH_ASSOC));
        
        // Recent product registrations
        $query = "SELECT 'product_registration' as type, 
                         CONCAT('Product ', product_id, ' registered') as description, 
                         registration_date as timestamp 
                  FROM products 
                  WHERE registration_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                  ORDER BY registration_date DESC LIMIT 5";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $activities = array_merge($activities, $stmt->fetchAll(PDO::FETCH_ASSOC));
        
        // Recent support tickets
        $query = "SELECT 'support_ticket' as type, 
                         CONCAT('Ticket: ', subject) as description, 
                         created_at as timestamp 
                  FROM support_tickets 
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                  ORDER BY created_at DESC LIMIT 5";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $activities = array_merge($activities, $stmt->fetchAll(PDO::FETCH_ASSOC));
        
        // Sort by timestamp
        usort($activities, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });
        
        return array_slice($activities, 0, 10);
    }

    private function getTotalCount($table) {
        $query = "SELECT COUNT(*) as count FROM $table";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }

    private function getActiveProductsCount() {
        $query = "SELECT COUNT(*) as count FROM products WHERE status = 'active'";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }

    private function getOpenTicketsCount() {
        $query = "SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }

    private function getRecentRegistrations() {
        $query = "SELECT u.name, u.phone, u.district, u.created_at
                  FROM users u
                  ORDER BY u.created_at DESC LIMIT 5";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getSystemHealth() {
        // Check for systems with errors or issues
        $query = "SELECT 
                    COUNT(*) as total_systems,
                    SUM(CASE WHEN system_status = 'error' THEN 1 ELSE 0 END) as error_systems,
                    SUM(CASE WHEN soil_moisture < 20 THEN 1 ELSE 0 END) as low_moisture_systems,
                    SUM(CASE WHEN temperature > 40 THEN 1 ELSE 0 END) as high_temp_systems
                  FROM system_data sd
                  INNER JOIN (
                      SELECT product_id, MAX(recorded_at) as max_recorded
                      FROM system_data
                      GROUP BY product_id
                  ) latest ON sd.product_id = latest.product_id AND sd.recorded_at = latest.max_recorded";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>