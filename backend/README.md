# ADIS Backend - Automated Drip Irrigation System

## Overview

This is the PHP backend API for the ADIS (Automated Drip Irrigation System) web application. It provides RESTful endpoints for user management, product registration, system data collection, crop management, and support services.

## Features

- **Authentication**: OTP-based authentication via SMS
- **User Management**: User registration and profile management
- **Product Management**: IoT device registration and monitoring
- **System Data**: Real-time sensor data collection and analytics
- **Crop Management**: Crop tracking and watering schedules
- **Support System**: Ticket management and document sharing
- **Admin Panel**: Administrative functions and analytics

## Requirements

- PHP 8.0 or higher
- MySQL/MariaDB 5.7 or higher
- Apache/Nginx web server
- XAMPP (recommended for development)

### PHP Extensions Required

- PDO
- PDO_MySQL
- JSON
- OpenSSL
- cURL
- GD (for image processing)

## Installation

### 1. XAMPP Setup

1. Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Start Apache and MySQL services
3. Open phpMyAdmin at `http://localhost/phpmyadmin`

### 2. Database Setup

1. Create a new database named `adis_system`
2. Import the database schema:
   ```sql
   mysql -u root -p adis_system < database_schema.sql
   ```
   Or use phpMyAdmin to import the `database_schema.sql` file

### 3. Configuration

1. Update database credentials in `config/database.php`:
   ```php
   private $host = "localhost";
   private $db_name = "adis_system";
   private $username = "root";
   private $password = "your_password";
   ```

2. Configure JWT secret in `config/config.php`:
   ```php
   define('JWT_SECRET', 'your-secure-secret-key');
   ```

3. Set up SMS API credentials (optional for development):
   ```php
   define('SMS_API_URL', 'your-sms-api-url');
   define('SMS_API_KEY', 'your-sms-api-key');
   ```

### 4. File Permissions

Ensure the uploads directory is writable:
```bash
chmod -R 755 uploads/
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Management
- `POST /api/users/register` - Register new user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard-data` - Get dashboard data

### Product Management
- `POST /api/products/register` - Register new product
- `GET /api/products/my-products` - Get user's products
- `GET /api/products/{id}/data` - Get product sensor data
- `PUT /api/products/{id}/settings` - Update product settings
- `POST /api/products/data` - Receive sensor data (IoT endpoint)

### Crop Management
- `GET /api/crops` - Get user's crops
- `POST /api/crops` - Create new crop
- `PUT /api/crops/{id}` - Update crop
- `DELETE /api/crops/{id}` - Delete crop

### Support System
- `GET /api/support/tickets` - Get user's tickets
- `POST /api/support/tickets` - Create support ticket
- `PUT /api/support/tickets/{id}` - Update ticket status
- `GET /api/support/documents` - Get public documents

### Dashboard
- `GET /api/dashboard/data` - Get dashboard data
- `GET /api/dashboard/analytics` - Get analytics data

### Admin (Requires admin privileges)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products
- `GET /api/admin/analytics` - Get system analytics
- `GET /api/admin/overview` - Get system overview
- `PUT /api/admin/users/{id}/status` - Update user admin status
- `GET /api/admin/tickets` - Get all support tickets
- `PUT /api/admin/tickets/{id}/status` - Update ticket status

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2024-01-01 12:00:00"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...],
  "timestamp": "2024-01-01 12:00:00"
}
```

## Testing

### Using Postman

1. Import the provided Postman collection
2. Set the base URL to `http://localhost/ADIS/backend/api`
3. Test the endpoints starting with authentication

### Sample API Calls

**Send OTP:**
```bash
curl -X POST http://localhost/ADIS/backend/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+265888123456"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost/ADIS/backend/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+265888123456", "otp": "123456"}'
```

**Register User:**
```bash
curl -X POST http://localhost/ADIS/backend/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+265888123456",
    "village": "Lilongwe",
    "district": "Lilongwe",
    "latitude": -13.9626,
    "longitude": 33.7741
  }'
```

## Security Features

- JWT token-based authentication
- Input validation and sanitization
- SQL injection prevention using prepared statements
- CORS configuration
- Rate limiting for OTP requests
- File upload validation
- Admin role-based access control

## Development

### Local Development Server

You can run the API using PHP's built-in server:

```bash
cd backend
php -S localhost:8000 -t api/
```

The API will be available at `http://localhost:8000`

### Database Migrations

To reset the database:
1. Drop the existing database
2. Create a new database
3. Import the schema again

### Adding New Endpoints

1. Create controller method in appropriate controller
2. Add route in `api/index.php`
3. Update this documentation

## Production Deployment

### Security Checklist

- [ ] Change default JWT secret
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Configure proper file permissions
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Implement rate limiting
- [ ] Set up monitoring

### Environment Variables

Create a `.env` file for production:
```
DB_HOST=localhost
DB_NAME=adis_system
DB_USER=your_user
DB_PASS=your_password
JWT_SECRET=your-production-secret
SMS_API_URL=your-sms-api
SMS_API_KEY=your-sms-key
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials
   - Ensure MySQL service is running
   - Verify database exists

2. **CORS Issues**
   - Check CORS configuration in `config/cors.php`
   - Verify allowed origins

3. **File Upload Issues**
   - Check directory permissions
   - Verify file size limits
   - Check PHP upload settings

4. **JWT Token Issues**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure proper header format

### Logs

Check PHP error logs and Apache/Nginx logs for detailed error information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For technical support, create a support ticket through the system or contact the development team.