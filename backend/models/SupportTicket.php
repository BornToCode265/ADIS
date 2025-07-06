<?php

class SupportTicket {
    private $conn;
    private $table_name = "support_tickets";

    public $id;
    public $user_id;
    public $product_id;
    public $subject;
    public $description;
    public $status;
    public $priority;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET user_id=:user_id, product_id=:product_id,
                    subject=:subject, description=:description,
                    status=:status, priority=:priority";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":subject", $this->subject);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":priority", $this->priority);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getTicketsByUserId($user_id) {
        $query = "SELECT st.*, u.name as user_name
                  FROM " . $this->table_name . " st
                  LEFT JOIN users u ON st.user_id = u.id
                  WHERE st.user_id = :user_id
                  ORDER BY st.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllTickets() {
        $query = "SELECT st.*, u.name as user_name, u.phone as user_phone
                  FROM " . $this->table_name . " st
                  LEFT JOIN users u ON st.user_id = u.id
                  ORDER BY st.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table_name . "
                SET status=:status, updated_at=CURRENT_TIMESTAMP
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }

    public function getTicketById($id) {
        $query = "SELECT st.*, u.name as user_name, u.phone as user_phone
                  FROM " . $this->table_name . " st
                  LEFT JOIN users u ON st.user_id = u.id
                  WHERE st.id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getTicketStats() {
        $query = "SELECT 
                    COUNT(*) as total_tickets,
                    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_tickets,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tickets,
                    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_tickets,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_tickets
                  FROM " . $this->table_name;

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>