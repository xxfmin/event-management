<?php
// API endpoint for adding a comment to an event
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $eventID     = intval($_POST['eventID'] ?? 0);
    $commentText = $conn->real_escape_string($_POST['commentText'] ?? '');
    $userID      = $_SESSION['userID'];

    if ($eventID <= 0 || !$commentText) {
        echo json_encode(["success" => false, "message" => "Invalid input."]);
        exit();
    }

    $sql = "INSERT INTO Comments (eventID, userID, commentText)
            VALUES ($eventID, $userID, '$commentText')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Comment added successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
