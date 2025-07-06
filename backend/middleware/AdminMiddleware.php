<?php

require_once __DIR__ . '/AuthMiddleware.php';

class AdminMiddleware {
    public static function requireAdmin() {
        $user = AuthMiddleware::requireAuth();
        
        if (!$user['is_admin']) {
            ResponseHelper::error("Admin access required", 403);
            exit();
        }
        
        return $user;
    }

    public static function isAdmin() {
        $user = AuthMiddleware::getCurrentUser();
        return $user && $user['is_admin'];
    }
}

?>