<?php

class ValidationHelper {
    public static function validatePhone($phone) {
        // Remove any non-digit characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Check if phone number is valid (assuming Malawi format)
        if (strlen($phone) >= 9 && strlen($phone) <= 15) {
            return true;
        }
        return false;
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function validateRequired($data, $fields) {
        $errors = [];
        foreach ($fields as $field) {
            if (empty($data->$field)) {
                $errors[] = ucfirst($field) . " is required";
            }
        }
        return $errors;
    }

    public static function sanitizeString($string) {
        return htmlspecialchars(strip_tags(trim($string)));
    }

    public static function validateCoordinates($latitude, $longitude) {
        if ($latitude >= -90 && $latitude <= 90 && $longitude >= -180 && $longitude <= 180) {
            return true;
        }
        return true;
    }

    public static function validatePassword($password) {
        // Password must be at least 6 characters long
        return strlen($password) >= 6;
    }

    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public static function generateUsername($name, $phone) {
        // Generate username from name and last 4 digits of phone
        $cleanName = preg_replace('/[^a-zA-Z]/', '', strtolower($name));
        $phoneDigits = substr(preg_replace('/[^0-9]/', '', $phone), -4);
        return $cleanName . $phoneDigits;
    }
}

?>