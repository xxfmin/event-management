<?php
// API endpoint for user login
session_start();
header("Content-Type: application/json");
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $conn->real_escape_string($_POST['username'] ?? '');
    $password = md5($_POST['password'] ?? '');

    $sql = "SELECT * FROM Users WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        $_SESSION['userID']   = $user['userID'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['userType'] = $user['userType'];
        echo json_encode(["success" => true, "message" => "Login successful.", "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid login credentials."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>