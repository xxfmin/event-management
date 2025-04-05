<?php
// API endpoint to retrieve details of a specific event including comments and average rating
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$eventID = intval($_GET['eventID'] ?? 0);
if ($eventID <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid event ID."]);
    exit();
}

// Fetch event details
$sqlEvent = "SELECT E.*, L.name as locationName FROM Events E JOIN Locations L ON E.locationID = L.locationID WHERE E.eventID = $eventID";
$eventResult = $conn->query($sqlEvent);
$event = $eventResult->fetch_assoc();

// Fetch comments
$sqlComments = "SELECT C.*, U.username FROM Comments C JOIN Users U ON C.userID = U.userID WHERE C.eventID = $eventID ORDER BY C.commentTimestamp DESC";
$commentsResult = $conn->query($sqlComments);
$comments = [];
while ($comment = $commentsResult->fetch_assoc()) {
    $comments[] = $comment;
}

// Fetch average rating
$sqlRating = "SELECT AVG(rating) as avgRating FROM Ratings WHERE eventID = $eventID";
$ratingResult = $conn->query($sqlRating);
$ratingData = $ratingResult->fetch_assoc();

echo json_encode([
    "success"   => true,
    "event"     => $event,
    "comments"  => $comments,
    "avgRating" => round($ratingData['avgRating'], 1)
]);
?>
