<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/SystemData.php';
require_once __DIR__ . '/../models/Crop.php';
require_once __DIR__ . '/../models/SupportTicket.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class DashboardController {
    private $db;
    private $user;
    private $product;
    private $systemData;
    private $crop;
    private $supportTicket;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->product = new Product($this->db);
        $this->systemData = new SystemData($this->db);
        $this->crop = new Crop($this->db);
        $this->supportTicket = new SupportTicket($this->db);
    }

    public function getDashboardData() {
        $user = AuthMiddleware::requireAuth();
        
        // Get user's products and their latest data
        $products = $this->product->getProductsByUserId($user['user_id']);
        $crops = $this->crop->getCropsByUserId($user['user_id']);
        $tickets = $this->supportTicket->getTicketsByUserId($user['user_id']);
        
        // Calculate summary statistics
        $totalProducts = count($products);
        $activeProducts = count(array_filter($products, function($p) { 
            return $p['status'] === 'active'; 
        }));
        
        $totalCrops = count($crops);
        $openTickets = count(array_filter($tickets, function($t) { 
            return $t['status'] === 'open'; 
        }));

        // Get recent system data for charts
        $recentData = [];
        foreach ($products as $product) {
            if ($product['product_id']) {
                $data = $this->systemData->getHistoricalData($product['product_id'], 7);
                if (!empty($data)) {
                    $recentData[$product['product_id']] = $data;
                }
            }
        }

        // Calculate water usage summary
        $totalWaterUsage = 0;
        foreach ($products as $product) {
            if (isset($product['water_usage_today'])) {
                $totalWaterUsage += $product['water_usage_today'];
            }
        }

        $dashboardData = [
            'summary' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'total_crops' => $totalCrops,
                'open_tickets' => $openTickets,
                'total_water_usage_today' => round($totalWaterUsage, 2)
            ],
            'products' => $products,
            'crops' => $crops,
            'recent_tickets' => array_slice($tickets, 0, 5), // Last 5 tickets
            'system_data' => $recentData,
            'alerts' => $this->getSystemAlerts($products)
        ];
        
        ResponseHelper::success("Dashboard data retrieved successfully", $dashboardData);
    }

    private function getSystemAlerts($products) {
        $alerts = [];
        
        foreach ($products as $product) {
            // Check for low soil moisture
            if (isset($product['soil_moisture']) && $product['soil_moisture'] < 30) {
                $alerts[] = [
                    'type' => 'warning',
                    'product_id' => $product['product_id'],
                    'message' => "Low soil moisture detected ({$product['soil_moisture']}%)",
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
            
            // Check for system errors
            if (isset($product['system_status']) && $product['system_status'] === 'error') {
                $alerts[] = [
                    'type' => 'error',
                    'product_id' => $product['product_id'],
                    'message' => "System error detected",
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
            
            // Check for high temperature
            if (isset($product['temperature']) && $product['temperature'] > 35) {
                $alerts[] = [
                    'type' => 'warning',
                    'product_id' => $product['product_id'],
                    'message' => "High temperature detected ({$product['temperature']}°C)",
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
        }
        
        return $alerts;
    }

    public function getAnalytics() {
        $user = AuthMiddleware::requireAuth();
        
        $products = $this->product->getProductsByUserId($user['user_id']);
        
        $analytics = [
            'water_usage_trend' => [],
            'soil_moisture_trend' => [],
            'temperature_trend' => [],
            'system_performance' => []
        ];
        
        foreach ($products as $product) {
            if ($product['product_id']) {
                $historicalData = $this->systemData->getHistoricalData($product['product_id'], 30);
                
                foreach ($historicalData as $data) {
                    $date = date('Y-m-d', strtotime($data['recorded_at']));
                    
                    if (!isset($analytics['water_usage_trend'][$date])) {
                        $analytics['water_usage_trend'][$date] = 0;
                    }
                    $analytics['water_usage_trend'][$date] += $data['water_usage_today'] ?? 0;
                    
                    $analytics['soil_moisture_trend'][] = [
                        'date' => $date,
                        'product_id' => $product['product_id'],
                        'value' => $data['soil_moisture']
                    ];
                    
                    $analytics['temperature_trend'][] = [
                        'date' => $date,
                        'product_id' => $product['product_id'],
                        'value' => $data['temperature']
                    ];
                }
            }
        }
        
        ResponseHelper::success("Analytics data retrieved successfully", $analytics);
    }
}

?>