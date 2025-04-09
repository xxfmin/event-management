<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$userID = intval($_SESSION['userID']);
$username = $conn->real_escape_string($_SESSION['username']);

$sql = "
  SELECT E.*, L.name AS locationName
  FROM Events E
  JOIN Locations L ON E.locationID = L.locationID
  WHERE
    E.eventType = 'public'
    OR (
      E.eventType = 'rso'
      AND E.rsoID IN (
        SELECT s.rsoID
        FROM Students_RSO s
        WHERE s.userID = $userID
      )
    )
    OR (
      E.eventType = 'private'
      AND ('$username' LIKE '%@ucf.edu')
    )
";

$result = $conn->query($sql);
$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode([
    "success" => true,
    "events" => $events
]);
?>
