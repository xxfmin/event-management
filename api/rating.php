<?php
// API endpoint for adding or updating a rating for an event
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $eventID = intval($_POST['eventID'] ?? 0);
    $rating  = intval($_POST['rating'] ?? 0);
    $userID  = $_SESSION['userID'];

    if ($eventID <= 0 || $rating < 1 || $rating > 5) {
        echo json_encode(["success" => false, "message" => "Invalid input."]);
        exit();
    }

    // check if the user already rated this event
    $sqlCheck = "SELECT * FROM Ratings WHERE eventID = $eventID AND userID = $userID";
    $checkResult = $conn->query($sqlCheck);
    if ($checkResult->num_rows > 0) {
        $sql = "UPDATE Ratings SET rating = $rating WHERE eventID = $eventID AND userID = $userID";
    } else {
        $sql = "INSERT INTO Ratings (eventID, userID, rating) VALUES ($eventID, $userID, $rating)";
    }
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Rating submitted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
