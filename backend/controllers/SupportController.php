<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/SupportTicket.php';
require_once __DIR__ . '/../utils/ResponseHelper.php';
require_once __DIR__ . '/../utils/ValidationHelper.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class SupportController {
    private $db;
    private $supportTicket;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->supportTicket = new SupportTicket($this->db);
    }

    public function getTickets() {
        $user = AuthMiddleware::requireAuth();
        
        $tickets = $this->supportTicket->getTicketsByUserId($user['user_id']);
        
        ResponseHelper::success("Support tickets retrieved successfully", $tickets);
    }

    public function createTicket() {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate required fields
        $required_fields = ['subject', 'description'];
        $errors = ValidationHelper::validateRequired($data, $required_fields);
        
        if (!empty($errors)) {
            ResponseHelper::error("Validation failed", 400, $errors);
            return;
        }

        // Validate priority if provided
        $validPriorities = ['low', 'medium', 'high', 'urgent'];
        $priority = isset($data->priority) ? $data->priority : 'medium';
        if (!in_array($priority, $validPriorities)) {
            ResponseHelper::error("Invalid priority level", 400);
            return;
        }

        $this->supportTicket->user_id = $user['user_id'];
        $this->supportTicket->product_id = isset($data->product_id) ? ValidationHelper::sanitizeString($data->product_id) : null;
        $this->supportTicket->subject = ValidationHelper::sanitizeString($data->subject);
        $this->supportTicket->description = ValidationHelper::sanitizeString($data->description);
        $this->supportTicket->status = 'open';
        $this->supportTicket->priority = $priority;

        if($this->supportTicket->create()) {
            ResponseHelper::success("Support ticket created successfully", [
                'ticket_id' => $this->supportTicket->id,
                'status' => $this->supportTicket->status
            ], 201);
        } else {
            ResponseHelper::error("Failed to create support ticket", 500);
        }
    }

    public function updateTicket($ticket_id) {
        $user = AuthMiddleware::requireAuth();
        $data = json_decode(file_get_contents("php://input"));
        
        // Get ticket to verify ownership
        $ticket = $this->supportTicket->getTicketById($ticket_id);
        
        if (!$ticket) {
            ResponseHelper::error("Ticket not found", 404);
            return;
        }

        // Only allow users to update their own tickets (unless admin)
        if ($ticket['user_id'] != $user['user_id'] && !$user['is_admin']) {
            ResponseHelper::error("Access denied", 403);
            return;
        }

        if (isset($data->status)) {
            $validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
            if (!in_array($data->status, $validStatuses)) {
                ResponseHelper::error("Invalid status", 400);
                return;
            }

            if($this->supportTicket->updateStatus($ticket_id, $data->status)) {
                ResponseHelper::success("Ticket status updated successfully");
            } else {
                ResponseHelper::error("Failed to update ticket status", 500);
            }
        } else {
            ResponseHelper::error("No valid updates provided", 400);
        }
    }

    public function getDocuments() {
        // Get public documents (manuals, guides, etc.)
        $query = "SELECT * FROM documents WHERE is_public = 1 ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        ResponseHelper::success("Documents retrieved successfully", $documents);
    }

    public function uploadDocument() {
        require_once __DIR__ . '/../middleware/AdminMiddleware.php';
        AdminMiddleware::requireAdmin();
        
        if (!isset($_FILES['document'])) {
            ResponseHelper::error("No file uploaded", 400);
            return;
        }

        $file = $_FILES['document'];
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $file_type = $_POST['file_type'] ?? 'manual';
        
        if (empty($title)) {
            ResponseHelper::error("Document title is required", 400);
            return;
        }

        // Validate file type
        $allowedTypes = ['pdf', 'video', 'image', 'manual'];
        if (!in_array($file_type, $allowedTypes)) {
            ResponseHelper::error("Invalid file type", 400);
            return;
        }

        // Check file size
        if ($file['size'] > MAX_FILE_SIZE) {
            ResponseHelper::error("File size too large", 400);
            return;
        }

        // Create upload directory if it doesn't exist
        $uploadDir = UPLOAD_PATH . 'documents/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate unique filename
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
        $filePath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            // Save to database
            $query = "INSERT INTO documents 
                      SET title=:title, file_name=:file_name, file_path=:file_path,
                          file_size=:file_size, file_type=:file_type, description=:description";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":file_name", $file['name']);
            $stmt->bindParam(":file_path", $filePath);
            $stmt->bindParam(":file_size", $file['size']);
            $stmt->bindParam(":file_type", $file_type);
            $stmt->bindParam(":description", $description);

            if ($stmt->execute()) {
                ResponseHelper::success("Document uploaded successfully", [
                    'document_id' => $this->db->lastInsertId(),
                    'file_name' => $fileName
                ]);
            } else {
                unlink($filePath); // Remove uploaded file if database insert fails
                ResponseHelper::error("Failed to save document information", 500);
            }
        } else {
            ResponseHelper::error("Failed to upload file", 500);
        }
    }
}

?>