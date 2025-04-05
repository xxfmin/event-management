<?php
// API endpoint for creating an event
session_start();
header("Content-Type: application/json");
include 'connection.php';

// make sure that an admin is logged in
if (!isset($_SESSION['userID']) || $_SESSION['userType'] != 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $eventName     = $conn->real_escape_string($_POST['eventName'] ?? '');
    $eventCategory = $conn->real_escape_string($_POST['eventCategory'] ?? '');
    $description   = $conn->real_escape_string($_POST['description'] ?? '');
    $eventDate     = $_POST['eventDate'] ?? '';
    $startTime     = $_POST['startTime'] ?? '';
    $endTime       = $_POST['endTime'] ?? '';
    $locationID    = intval($_POST['locationID'] ?? 0);
    $contactPhone  = $conn->real_escape_string($_POST['contactPhone'] ?? '');
    $contactEmail  = $conn->real_escape_string($_POST['contactEmail'] ?? '');
    $eventType     = $conn->real_escape_string($_POST['eventType'] ?? 'public');
    $rsoID         = isset($_POST['rsoID']) && $_POST['rsoID'] != "" ? intval($_POST['rsoID']) : null;
    $createdBy     = $_SESSION['userID'];
    $approvedBy    = ($eventType == 'public') ? null : $_SESSION['userID'];

    if (!$eventName || !$eventDate || !$startTime || !$endTime || !$locationID) {
        echo json_encode(["success" => false, "message" => "Missing required event details."]);
        exit();
    }

    $sql = "INSERT INTO Events (eventName, eventCategory, description, eventDate, startTime, endTime, locationID, contactPhone, contactEmail, createdBy, approvedBy, rsoID, eventType)
            VALUES ('$eventName', '$eventCategory', '$description', '$eventDate', '$startTime', '$endTime', $locationID, '$contactPhone', '$contactEmail', $createdBy, " . ($approvedBy === null ? "NULL" : $approvedBy) . ", " . ($rsoID === null ? "NULL" : $rsoID) . ", '$eventType')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Event created successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
