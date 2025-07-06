<?php

// API Configuration
define('API_VERSION', '1.0');
define('JWT_SECRET', 'ADIS-secret-key-2025-secure');
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
define('ALLOWED_ORIGINS','*'); // Allow all origins for development, restrict in production]);

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>