<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$sql = "SELECT rsoID, name, description, status FROM RSOs ORDER BY name ASC";
$result = $conn->query($sql);
$rsos = [];
while ($row = $result->fetch_assoc()) {
    $rsos[] = $row;
}

echo json_encode(["success" => true, "rsos" => $rsos]);
?>
