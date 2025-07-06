<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/cors.php';

// Handle CORS
handleCORS();

// Set JSON header
header('Content-Type: application/json');

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove the base path to get the API endpoint
$basePath = '/ADIS/backend/api';
$path = str_replace($basePath, '', $path);

// Remove leading slash
$path = ltrim($path, '/');

// Split path into segments
$pathSegments = explode('/', $path);

try {
    // Route handling
    switch($pathSegments[0]) {
        case 'auth':
            require_once __DIR__ . '/../controllers/AuthController.php';
            $controller = new AuthController();
            
            switch($pathSegments[1] ?? '') {
                case 'login':
                    if($method === 'POST') {
                        $controller->login();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'send-otp':
                    if($method === 'POST') {
                        $controller->sendOTP();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'verify-otp':
                    if($method === 'POST') {
                        $controller->verifyOTP();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'logout':
                    if($method === 'POST') {
                        $controller->logout();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'refresh-token':
                    if($method === 'POST') {
                        $controller->refreshToken();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Auth endpoint not found']);
                    break;
            }
            break;
            
        case 'users':
            require_once __DIR__ . '/../controllers/UserController.php';
            $controller = new UserController();
            
            switch($pathSegments[1] ?? '') {
                case 'register':
                    if($method === 'POST') {
                        $controller->register();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'profile':
                    if($method === 'GET') {
                        $controller->getProfile();
                    } elseif($method === 'PUT') {
                        $controller->updateProfile();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'dashboard-data':
                    if($method === 'GET') {
                        $controller->getDashboardData();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'User endpoint not found']);
                    break;
            }
            break;
            
        case 'products':
            require_once __DIR__ . '/../controllers/ProductController.php';
            $controller = new ProductController();
            
            switch($pathSegments[1] ?? '') {
                case 'register':
                    if($method === 'POST') {
                        $controller->register();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'my-products':
                    if($method === 'GET') {
                        $controller->getMyProducts();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'data':
                    if($method === 'POST') {
                        $controller->receiveSystemData();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                default:
                    // Handle product-specific endpoints like /products/{product_id}/data
                    if (isset($pathSegments[1]) && isset($pathSegments[2])) {
                        $product_id = $pathSegments[1];
                        $action = $pathSegments[2];
                        
                        switch($action) {
                            case 'data':
                                if($method === 'GET') {
                                    $controller->getProductData($product_id);
                                } else {
                                    http_response_code(405);
                                    echo json_encode(['error' => 'Method not allowed']);
                                }
                                break;
                                
                            case 'settings':
                                if($method === 'PUT') {
                                    $controller->updateProductSettings($product_id);
                                } else {
                                    http_response_code(405);
                                    echo json_encode(['error' => 'Method not allowed']);
                                }
                                break;
                                
                            default:
                                http_response_code(404);
                                echo json_encode(['error' => 'Product action not found']);
                                break;
                        }
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Product endpoint not found']);
                    }
                    break;
            }
            break;
            
        case 'crops':
            require_once __DIR__ . '/../controllers/CropController.php';
            $controller = new CropController();
            
            if (empty($pathSegments[1])) {
                // /crops endpoint
                if($method === 'GET') {
                    $controller->getCrops();
                } elseif($method === 'POST') {
                    $controller->createCrop();
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                }
            } else {
                // /crops/{crop_id} endpoint
                $crop_id = $pathSegments[1];
                if($method === 'PUT') {
                    $controller->updateCrop($crop_id);
                } elseif($method === 'DELETE') {
                    $controller->deleteCrop($crop_id);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                }
            }
            break;
            
        case 'support':
            require_once __DIR__ . '/../controllers/SupportController.php';
            $controller = new SupportController();
            
            switch($pathSegments[1] ?? '') {
                case 'tickets':
                    if (empty($pathSegments[2])) {
                        // /support/tickets endpoint
                        if($method === 'GET') {
                            $controller->getTickets();
                        } elseif($method === 'POST') {
                            $controller->createTicket();
                        } else {
                            http_response_code(405);
                            echo json_encode(['error' => 'Method not allowed']);
                        }
                    } else {
                        // /support/tickets/{ticket_id} endpoint
                        $ticket_id = $pathSegments[2];
                        if($method === 'PUT') {
                            $controller->updateTicket($ticket_id);
                        } else {
                            http_response_code(405);
                            echo json_encode(['error' => 'Method not allowed']);
                        }
                    }
                    break;
                    
                case 'documents':
                    if($method === 'GET') {
                        $controller->getDocuments();
                    } elseif($method === 'POST') {
                        $controller->uploadDocument();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Support endpoint not found']);
                    break;
            }
            break;
            
        case 'dashboard':
            require_once __DIR__ . '/../controllers/DashboardController.php';
            $controller = new DashboardController();
            
            switch($pathSegments[1] ?? '') {
                case 'data':
                    if($method === 'GET') {
                        $controller->getDashboardData();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'analytics':
                    if($method === 'GET') {
                        $controller->getAnalytics();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Dashboard endpoint not found']);
                    break;
            }
            break;
            
        case 'admin':
            require_once __DIR__ . '/../controllers/AdminController.php';
            $controller = new AdminController();
            
            switch($pathSegments[1] ?? '') {
                case 'users':
                    if (empty($pathSegments[2])) {
                        if($method === 'GET') {
                            $controller->getUsers();
                        } else {
                            http_response_code(405);
                            echo json_encode(['error' => 'Method not allowed']);
                        }
                    } else {
                        // /admin/users/{user_id}/status
                        $user_id = $pathSegments[2];
                        if (isset($pathSegments[3]) && $pathSegments[3] === 'status') {
                            if($method === 'PUT') {
                                $controller->updateUserStatus($user_id);
                            } else {
                                http_response_code(405);
                                echo json_encode(['error' => 'Method not allowed']);
                            }
                        } else {
                            http_response_code(404);
                            echo json_encode(['error' => 'Admin user endpoint not found']);
                        }
                    }
                    break;
                    
                case 'products':
                    if($method === 'GET') {
                        $controller->getProducts();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'analytics':
                    if($method === 'GET') {
                        $controller->getAnalytics();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'overview':
                    if($method === 'GET') {
                        $controller->getSystemOverview();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Method not allowed']);
                    }
                    break;
                    
                case 'tickets':
                    if (empty($pathSegments[2])) {
                        if($method === 'GET') {
                            $controller->getAllTickets();
                        } else {
                            http_response_code(405);
                            echo json_encode(['error' => 'Method not allowed']);
                        }
                    } else {
                        // /admin/tickets/{ticket_id}/status
                        $ticket_id = $pathSegments[2];
                        if (isset($pathSegments[3]) && $pathSegments[3] === 'status') {
                            if($method === 'PUT') {
                                $controller->updateTicketStatus($ticket_id);
                            } else {
                                http_response_code(405);
                                echo json_encode(['error' => 'Method not allowed']);
                            }
                        } else {
                            http_response_code(404);
                            echo json_encode(['error' => 'Admin ticket endpoint not found']);
                        }
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Admin endpoint not found']);
                    break;
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint not found']);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}

?>