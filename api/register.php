<?php
// API endpoint for user registration
header("Content-Type: application/json");
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitize inputs
    $username = $conn->real_escape_string($_POST['username'] ?? '');
    $password = md5($_POST['password'] ?? '');
    $email = $conn->real_escape_string($_POST['email'] ?? '');
    $userType = $conn->real_escape_string($_POST['userType'] ?? '');
    $studentID = $conn->real_escape_string($_POST['studentID'] ?? '');
    
    // Validate that studentID is exactly 7 digits
    if (!preg_match('/^\d{7}$/', $studentID)) {
        echo json_encode(["success" => false, "message" => "Student ID must be exactly 7 digits."]);
        exit();
    }
    
    $sql = "INSERT INTO Users (studentID, username, password, email, userType)
            VALUES ('$studentID', '$username', '$password', '$email', '$userType')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Registration successful."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
