<?php
// API endpoint to retrieve details of a specific event including comments and average rating
session_start();
header("Content-Type: application/json");
include 'connection.php';

// Check if user is logged in
if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

// Validate the eventID
if (!isset($_GET['eventID']) || !ctype_digit($_GET['eventID'])) {
    echo json_encode(["success" => false, "message" => "Invalid or missing event ID."]);
    exit();
}
$eventID = intval($_GET['eventID']);
if ($eventID <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid event ID."]);
    exit();
}

// Fetch event details
$sqlEvent = "SELECT E.*, L.name as locationName 
             FROM Events E 
             JOIN Locations L ON E.locationID = L.locationID 
             WHERE E.eventID = $eventID";
$eventResult = $conn->query($sqlEvent);
$event = $eventResult->fetch_assoc();

// Fetch comments (with usernames)
$sqlComments = "SELECT C.*, U.username 
                FROM Comments C 
                JOIN Users U ON C.userID = U.userID 
                WHERE C.eventID = $eventID 
                ORDER BY C.commentTimestamp DESC";
$commentsResult = $conn->query($sqlComments);
$comments = [];
while ($comment = $commentsResult->fetch_assoc()) {
    $comments[] = $comment;
}

// Fetch average rating
$sqlRating = "SELECT AVG(rating) AS avgRating 
              FROM Ratings 
              WHERE eventID = $eventID";
$ratingResult = $conn->query($sqlRating);
$ratingData   = $ratingResult->fetch_assoc();

// If avgRating is NULL, treat it as 0.0 to avoid passing NULL to round()
$avgRatingValue = $ratingData['avgRating'] === null ? 0.0 : (float)$ratingData['avgRating'];

// Output the JSON
echo json_encode([
    "success"   => true,
    "event"     => $event,
    "comments"  => $comments,
    "avgRating" => round($avgRatingValue, 1)
]);
?>
