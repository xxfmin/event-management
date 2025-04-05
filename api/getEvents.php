<?php
// API endpoint to retrieve events accessible to the logged-in user
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$userID = $_SESSION['userID'];
// Retrieve public events, private events (for the user’s university), or RSO events (if the user is a member).
$sql = "SELECT E.*, L.name as locationName FROM Events E
        JOIN Locations L ON E.locationID = L.locationID
        WHERE E.eventType = 'public'
        OR (E.eventType = 'private' AND E.createdBy IN (SELECT userID FROM Users WHERE universityID = (SELECT universityID FROM Users WHERE userID = $userID)))
        OR (E.eventType = 'rso' AND E.rsoID IN (SELECT rsoID FROM Students_RSO WHERE userID = $userID))";
$result = $conn->query($sql);

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}
echo json_encode(["success" => true, "events" => $events]);
?>
