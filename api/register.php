<?php
// API endpoint for user registration
header("Content-Type: application/json");
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username     = $conn->real_escape_string($_POST['username'] ?? '');
    $password     = md5($_POST['password'] ?? '');
    $email        = $conn->real_escape_string($_POST['email'] ?? '');
    $userType     = $conn->real_escape_string($_POST['userType'] ?? '');
    $universityID = intval($_POST['universityID'] ?? 0);

    if (!$username || !$password || !$email || !$userType || !$universityID) {
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
        exit();
    }

    $sql = "INSERT INTO Users (username, password, email, userType, universityID)
            VALUES ('$username', '$password', '$email', '$userType', $universityID)";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Registration successful."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
