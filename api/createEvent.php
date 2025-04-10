<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

// Enable MySQLi exceptions
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Read and escape your input values here...
    $eventName     = $conn->real_escape_string($_POST['eventName'] ?? '');
    $eventCategory = $conn->real_escape_string($_POST['eventCategory'] ?? '');
    $description   = $conn->real_escape_string($_POST['description'] ?? '');
    $eventDate     = $_POST['eventDate'] ?? '';
    $startTime     = $_POST['startTime'] ?? '';
    $endTime       = $_POST['endTime'] ?? '';
    // $locationID    = intval($_POST['locationID'] ?? 0);
    $locationID = 1;
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

    // Build the INSERT query using proper handling for NULL values
    $approvedBySql = ($approvedBy === null) ? "NULL" : $approvedBy;
    $rsoIDSql      = ($rsoID === null) ? "NULL" : $rsoID;

    $sql = "INSERT INTO Events (eventName, eventCategory, description, eventDate, startTime, endTime, locationID, contactPhone, contactEmail, createdBy, approvedBy, rsoID, eventType)
            VALUES ('$eventName', '$eventCategory', '$description', '$eventDate', '$startTime', '$endTime', $locationID, '$contactPhone', '$contactEmail', $createdBy, $approvedBySql, $rsoIDSql, '$eventType')";

    try {
        $conn->query($sql);
        echo json_encode(["success" => true, "message" => "Event created successfully."]);
    } catch (Exception $e) {
        // This should capture the custom SIGNAL error message from the trigger.
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
