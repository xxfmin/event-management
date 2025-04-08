<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';
if (!isset($_SESSION['userID'])) {
  echo json_encode(["success" => false, "message" => "Unauthorized access."]);
  exit();
}
$adminID = intval($_SESSION['userID']);
$sql = "SELECT R.requestID, R.userID, R.rsoID, R.requestDate, R.status, U.username
        FROM RSO_Requests R
        JOIN RSOs ON R.rsoID = RSOs.rsoID
        JOIN Users U ON R.userID = U.userID
        WHERE RSOs.adminID = $adminID AND R.status = 'pending'
        ORDER BY R.requestDate DESC";
$result = $conn->query($sql);
$requests = [];
while($row = $result->fetch_assoc()){
  $requests[] = $row;
}
echo json_encode(["success" => true, "requests" => $requests]);
?>
