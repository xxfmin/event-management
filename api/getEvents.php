<?php
// API endpoint to retrieve events accessible to the logged-in user
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$userID = intval($_SESSION['userID']);

$sql = "SELECT E.*, L.name AS locationName 
        FROM Events E 
        JOIN Locations L ON E.locationID = L.locationID 
        WHERE E.eventType = 'public' 
           OR E.eventType = 'private'
           OR (E.eventType = 'rso' AND E.rsoID IN (SELECT rsoID FROM Students_RSO WHERE userID = $userID))";

$result = $conn->query($sql);
$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}
echo json_encode(["success" => true, "events" => $events]);
?>