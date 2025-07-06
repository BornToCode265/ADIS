<?php

class OTPService {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function generateOTP($phone) {
        // Generate 6-digit OTP
        $otp = sprintf("%06d", mt_rand(100000, 999999));
        
        // Store in database
        $query = "INSERT INTO otp_verifications
                  SET phone=:phone, otp_code=:otp, expires_at=:expires_at";
        
        $stmt = $this->conn->prepare($query);
        $expires_at = date('Y-m-d H:i:s', time() + OTP_EXPIRY);
        
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":otp", $otp);
        $stmt->bindParam(":expires_at", $expires_at);
        
        if($stmt->execute()) {
            return $otp;
        }
        return false;
    }

    public function verifyOTP($phone, $otp) {
        $query = "SELECT * FROM otp_verifications
                  WHERE phone=:phone AND otp_code=:otp
                  AND expires_at > NOW() AND is_used=0
                  ORDER BY created_at DESC LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":otp", $otp);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            // Mark OTP as used
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $update_query = "UPDATE otp_verifications SET is_used=1 WHERE id=:id";
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bindParam(":id", $row['id']);
            $update_stmt->execute();
            
            return true;
        }
        return false;
    }

    public function sendSMS($phone, $otp) {
        // Implement SMS sending logic here
        // For development, you can log to file or return true
        $message = "Your ADIS verification code is: $otp. Valid for 5 minutes.";
        
        // Example using cURL for SMS API
        /*
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => SMS_API_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'to' => $phone,
                'message' => $message,
                'api_key' => SMS_API_KEY
            ]),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json']
        ));
        
        $response = curl_exec($curl);
        curl_close($curl);
        */
        
        // For development, just return true
        error_log("SMS OTP: $phone - $otp");
        return true;
    }
}

?>