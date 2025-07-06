<?php

require_once __DIR__ . '/../utils/JWTHelper.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader)) {
            ResponseHelper::error("Authorization header missing", 401);
            return false;
        }

        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            ResponseHelper::error("Invalid authorization header format", 401);
            return false;
        }

        $token = $matches[1];
        $decoded = JWTHelper::decode($token);

        if (!$decoded) {
            ResponseHelper::error("Invalid or expired token", 401);
            return false;
        }

        return $decoded;
    }

    public static function getCurrentUser() {
        return self::authenticate();
    }

    public static function requireAuth() {
        $user = self::authenticate();
        if (!$user) {
            exit();
        }
        return $user;
    }
}

?>