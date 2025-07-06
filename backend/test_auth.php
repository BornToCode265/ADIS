<?php
// Test script for authentication system
// Run this script to test user registration and login

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/utils/ValidationHelper.php';

echo "Testing ADIS Authentication System\n";
echo "==================================\n\n";

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    // Test 1: Username generation
    echo "Test 1: Username Generation\n";
    $username = ValidationHelper::generateUsername("John Banda", "+265888123456");
    echo "Generated username: $username\n\n";

    // Test 2: Password hashing
    echo "Test 2: Password Hashing\n";
    $password = "testpassword123";
    $hash = ValidationHelper::hashPassword($password);
    echo "Password: $password\n";
    echo "Hash: $hash\n";
    echo "Verification: " . (ValidationHelper::verifyPassword($password, $hash) ? "PASS" : "FAIL") . "\n\n";

    // Test 3: User registration simulation
    echo "Test 3: User Registration Simulation\n";
    $testUser = [
        'name' => 'Test User',
        'phone' => '+265888999888',
        'password' => 'testpass123',
        'district' => 'Lilongwe',
        'village' => 'Test Village'
    ];

    $username = ValidationHelper::generateUsername($testUser['name'], $testUser['phone']);
    echo "Test user data:\n";
    echo "Name: {$testUser['name']}\n";
    echo "Phone: {$testUser['phone']}\n";
    echo "Generated username: $username\n";
    echo "Password: {$testUser['password']}\n";
    echo "District: {$testUser['district']}\n\n";

    // Test 4: Check if user exists
    echo "Test 4: User Existence Check\n";
    $exists = $user->findByPhone($testUser['phone']);
    echo "User exists: " . ($exists ? "YES" : "NO") . "\n\n";

    // Test 5: Username uniqueness check
    echo "Test 5: Username Uniqueness Check\n";
    $usernameExists = $user->usernameExists($username);
    echo "Username '$username' exists: " . ($usernameExists ? "YES" : "NO") . "\n\n";

    echo "Authentication system tests completed successfully!\n";
    echo "You can now test the API endpoints:\n";
    echo "- POST /ADIS/backend/api/users/register\n";
    echo "- POST /ADIS/backend/api/auth/login\n";
    echo "- POST /ADIS/backend/api/auth/logout\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Make sure the database is set up and accessible.\n";
}
?>