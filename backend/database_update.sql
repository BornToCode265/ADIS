-- Database update script to add username and password support
-- Run this script to update existing ADIS database

USE adis_system;

-- Add username and password_hash columns to users table
ALTER TABLE users 
ADD COLUMN username VARCHAR(100) UNIQUE AFTER phone,
ADD COLUMN password_hash VARCHAR(255) AFTER username;

-- Add index for username
CREATE INDEX idx_username ON users(username);

-- Update existing admin user with default credentials
UPDATE users 
SET username = 'admin', 
    password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- password: password
WHERE phone = '+265888000000' AND is_admin = TRUE;

-- Note: The password hash above is for the password "password"
-- In production, you should change this to a secure password