<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID']) || $_SESSION['userType'] !== "admin") {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$userID = intval($_SESSION['userID']);
$eventID = intval($_POST['eventID'] ?? 0);
if ($eventID <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid event ID."]);
    exit();
}

$sqlCheck = "SELECT * FROM Events WHERE eventID = $eventID AND createdBy = $userID";
$result = $conn->query($sqlCheck);
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Event not found or unauthorized."]);
    exit();
}

$sqlDelete = "DELETE FROM Events WHERE eventID = $eventID";
if ($conn->query($sqlDelete) === TRUE) {
    echo json_encode(["success" => true, "message" => "Event deleted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting event: " . $conn->error]);
}
?>
