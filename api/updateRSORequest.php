<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';
if (!isset($_SESSION['userID'])) {
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit();
}
$adminID = intval($_SESSION['userID']);
$requestID = intval($_POST['requestID'] ?? 0);
$action = $_POST['action'] ?? '';
if($requestID <= 0 || ($action !== 'accepted' && $action !== 'rejected')){
  echo json_encode(["success" => false, "message" => "Invalid input."]);
  exit();
}
$sqlCheck = "SELECT R.*, RSOs.adminID FROM RSO_Requests R JOIN RSOs ON R.rsoID = RSOs.rsoID WHERE R.requestID = $requestID";
$resultCheck = $conn->query($sqlCheck);
if($resultCheck->num_rows == 0){
  echo json_encode(["success" => false, "message" => "Request not found."]);
  exit();
}
$row = $resultCheck->fetch_assoc();
if(intval($row['adminID']) !== $adminID){
  echo json_encode(["success" => false, "message" => "Not authorized to update this request."]);
  exit();
}
$sql = "UPDATE RSO_Requests SET status = '$action' WHERE requestID = $requestID";
if($conn->query($sql) === TRUE){
  if($action === 'accepted'){
    $userID = intval($row['userID']);
    $rsoID = intval($row['rsoID']);
    $sqlInsert = "INSERT INTO Students_RSO (userID, rsoID) VALUES ($userID, $rsoID)";
    $conn->query($sqlInsert);
  }
  echo json_encode(["success" => true, "message" => "Request $action successfully."]);
} else {
  echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}
?>
