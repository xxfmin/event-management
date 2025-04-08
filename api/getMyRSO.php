<?php
// This endpoint returns the RSO associated with the admin if one exists
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID']) || $_SESSION['userType'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$adminID = intval($_SESSION['userID']);
$sql = "SELECT * FROM RSOs WHERE adminID = $adminID LIMIT 1";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $rso = $result->fetch_assoc();
    echo json_encode(["success" => true, "rso" => $rso]);
} else {
    echo json_encode(["success" => true, "rso" => null]);
}
?>
