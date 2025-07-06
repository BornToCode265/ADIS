<?php

// Simple API test script
// Run this file to test if the backend is working correctly

require_once 'config/database.php';
require_once 'config/config.php';

echo "<h1>ADIS Backend API Test</h1>";

// Test 1: Database Connection
echo "<h2>1. Database Connection Test</h2>";
try {
    $database = new Database();
    $db = $database->getConnection();
    if ($db) {
        echo "<p style='color: green;'>✓ Database connection successful</p>";
        
        // Test if tables exist
        $tables = ['users', 'products', 'otp_verifications', 'system_data', 'crops', 'support_tickets', 'documents'];
        foreach ($tables as $table) {
            $stmt = $db->prepare("SHOW TABLES LIKE '$table'");
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo "<p style='color: green;'>✓ Table '$table' exists</p>";
            } else {
                echo "<p style='color: red;'>✗ Table '$table' missing</p>";
            }
        }
    } else {
        echo "<p style='color: red;'>✗ Database connection failed</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Database error: " . $e->getMessage() . "</p>";
}

// Test 2: Configuration
echo "<h2>2. Configuration Test</h2>";
if (defined('JWT_SECRET')) {
    echo "<p style='color: green;'>✓ JWT_SECRET is defined</p>";
} else {
    echo "<p style='color: red;'>✗ JWT_SECRET not defined</p>";
}

if (defined('OTP_EXPIRY')) {
    echo "<p style='color: green;'>✓ OTP_EXPIRY is defined (" . OTP_EXPIRY . " seconds)</p>";
} else {
    echo "<p style='color: red;'>✗ OTP_EXPIRY not defined</p>";
}

// Test 3: Required PHP Extensions
echo "<h2>3. PHP Extensions Test</h2>";
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'openssl', 'curl'];
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<p style='color: green;'>✓ Extension '$ext' loaded</p>";
    } else {
        echo "<p style='color: red;'>✗ Extension '$ext' not loaded</p>";
    }
}

// Test 4: Directory Permissions
echo "<h2>4. Directory Permissions Test</h2>";
$upload_dir = __DIR__ . '/uploads/';
if (is_dir($upload_dir)) {
    if (is_writable($upload_dir)) {
        echo "<p style='color: green;'>✓ Uploads directory is writable</p>";
    } else {
        echo "<p style='color: orange;'>⚠ Uploads directory exists but not writable</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Uploads directory does not exist</p>";
}

// Test 5: API Endpoint Test
echo "<h2>5. API Endpoint Test</h2>";
$base_url = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/api/';

// Test a simple endpoint
$test_url = $base_url . 'auth/send-otp';
echo "<p>Testing endpoint: <code>$test_url</code></p>";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $test_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['phone' => '+265888123456']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response !== false) {
    echo "<p style='color: green;'>✓ API endpoint accessible (HTTP $http_code)</p>";
    $decoded = json_decode($response, true);
    if ($decoded) {
        echo "<p>Response: <code>" . htmlspecialchars($response) . "</code></p>";
    }
} else {
    echo "<p style='color: red;'>✗ API endpoint not accessible</p>";
}

// Test 6: Sample Data
echo "<h2>6. Sample Data Test</h2>";
try {
    // Check if admin user exists
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM users WHERE is_admin = 1");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] > 0) {
        echo "<p style='color: green;'>✓ Admin user exists</p>";
    } else {
        echo "<p style='color: orange;'>⚠ No admin user found</p>";
    }
    
    // Check if sample documents exist
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM documents");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] > 0) {
        echo "<p style='color: green;'>✓ Sample documents exist ({$result['count']} documents)</p>";
    } else {
        echo "<p style='color: orange;'>⚠ No sample documents found</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error checking sample data: " . $e->getMessage() . "</p>";
}

echo "<h2>Test Complete</h2>";
echo "<p>If all tests pass, your ADIS backend is ready to use!</p>";
echo "<p>API Base URL: <code>$base_url</code></p>";

?>