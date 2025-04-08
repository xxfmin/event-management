<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';
if (!isset($_SESSION['userID'])) {
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit();
}
$userID = intval($_SESSION['userID']);
$rsoID = intval($_POST['rsoID'] ?? 0);
if($rsoID <= 0){
  echo json_encode(["success" => false, "message" => "Invalid RSO ID."]);
  exit();
}
$sqlCheck = "SELECT * FROM RSO_Requests WHERE userID = $userID AND rsoID = $rsoID";
$resultCheck = $conn->query($sqlCheck);
if($resultCheck->num_rows > 0){
  echo json_encode(["success" => false, "message" => "Request already submitted."]);
  exit();
}
$sql = "INSERT INTO RSO_Requests (userID, rsoID) VALUES ($userID, $rsoID)";
if($conn->query($sql) === TRUE){
  echo json_encode(["success" => true, "message" => "Join request submitted successfully."]);
} else {
  echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}
?>
