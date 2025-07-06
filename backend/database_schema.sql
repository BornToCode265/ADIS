-- ADIS Database Schema
-- Automated Drip Irrigation System

CREATE DATABASE IF NOT EXISTS adis_system;
USE adis_system;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    village VARCHAR(255),
    traditional_authority VARCHAR(255),
    district VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_username (username),
    INDEX idx_district (district)
);

-- 2. Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- 3. OTP Verification Table
CREATE TABLE otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone_otp (phone, otp_code),
    INDEX idx_expires_at (expires_at)
);

-- 4. System Data Table
CREATE TABLE system_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    soil_moisture DECIMAL(5,2),
    water_usage_today DECIMAL(8,2),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    system_status ENUM('active', 'inactive', 'error') DEFAULT 'active',
    last_watering TIMESTAMP,
    next_watering TIMESTAMP,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_recorded (product_id, recorded_at),
    INDEX idx_recorded_at (recorded_at)
);

-- 5. Crops Table
CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    planting_date DATE NOT NULL,
    growth_stage ENUM('seedling', 'vegetative', 'flowering', 'fruiting', 'harvest') DEFAULT 'seedling',
    watering_schedule JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_crops (user_id),
    INDEX idx_growth_stage (growth_stage)
);

-- 6. Support Tickets Table
CREATE TABLE support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_tickets (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- 7. Documents Table
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_type ENUM('pdf', 'video', 'image', 'manual') NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_file_type (file_type),
    INDEX idx_is_public (is_public)
);

-- Insert default admin user
INSERT INTO users (name, phone, district, is_admin) VALUES 
('Admin User', '+265888000000', 'Lilongwe', TRUE);

-- Insert sample documents
INSERT INTO documents (title, file_name, file_path, file_size, file_type, description) VALUES 
('ADIS User Manual', 'adis_user_manual.pdf', '/uploads/documents/adis_user_manual.pdf', 1024000, 'manual', 'Complete user manual for ADIS system'),
('Installation Guide', 'installation_guide.pdf', '/uploads/documents/installation_guide.pdf', 512000, 'manual', 'Step-by-step installation guide'),
('Troubleshooting Video', 'troubleshooting.mp4', '/uploads/documents/troubleshooting.mp4', 5120000, 'video', 'Video guide for common troubleshooting');

-- Create views for reporting
CREATE VIEW user_product_summary AS
SELECT 
    u.id as user_id,
    u.name,
    u.phone,
    u.district,
    COUNT(p.id) as total_products,
    SUM(CASE WHEN p.status = 'active' THEN 1 ELSE 0 END) as active_products
FROM users u
LEFT JOIN products p ON u.id = p.user_id
GROUP BY u.id;

CREATE VIEW system_health_summary AS
SELECT 
    p.product_id,
    p.status as product_status,
    sd.system_status,
    sd.soil_moisture,
    sd.temperature,
    sd.humidity,
    sd.recorded_at,
    u.name as user_name,
    u.phone as user_phone
FROM products p
LEFT JOIN system_data sd ON p.product_id = sd.product_id
LEFT JOIN users u ON p.user_id = u.id
WHERE sd.id IN (
    SELECT MAX(id) 
    FROM system_data 
    GROUP BY product_id
);

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetUserDashboard(IN user_id INT)
BEGIN
    -- Get user products
    SELECT p.*, sd.soil_moisture, sd.water_usage_today, sd.temperature, 
           sd.humidity, sd.system_status, sd.last_watering, sd.next_watering
    FROM products p
    LEFT JOIN system_data sd ON p.product_id = sd.product_id
    WHERE p.user_id = user_id
    AND (sd.id IS NULL OR sd.id IN (
        SELECT MAX(id) FROM system_data GROUP BY product_id
    ));
    
    -- Get user crops
    SELECT * FROM crops WHERE user_id = user_id ORDER BY created_at DESC;
    
    -- Get recent tickets
    SELECT * FROM support_tickets 
    WHERE user_id = user_id 
    ORDER BY created_at DESC LIMIT 5;
END //

CREATE PROCEDURE CleanupExpiredOTP()
BEGIN
    DELETE FROM otp_verifications 
    WHERE expires_at < NOW() OR is_used = TRUE;
END //

DELIMITER ;

-- Create events for automatic cleanup
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS cleanup_expired_otp
ON SCHEDULE EVERY 1 HOUR
DO
  CALL CleanupExpiredOTP();