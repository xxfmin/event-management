<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID']) || $_SESSION['userType'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$name = $conn->real_escape_string($_POST['name'] ?? '');
$description = $conn->real_escape_string($_POST['description'] ?? '');
$adminID = intval($_SESSION['userID']);

if (!$name) {
    echo json_encode(["success" => false, "message" => "RSO name is required."]);
    exit();
}

$sql = "INSERT INTO RSOs (name, description, adminID) VALUES ('$name', '$description', $adminID)";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "RSO created successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}
?>
