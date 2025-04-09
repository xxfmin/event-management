<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$userID = intval($_SESSION['userID']);
$commentID = intval($_POST['commentID'] ?? 0);

if ($commentID <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid comment ID."]);
    exit();
}

$sqlCheck = "SELECT * FROM Comments WHERE commentID = $commentID AND userID = $userID";
$result = $conn->query($sqlCheck);
if ($result->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Not authorized to delete this comment."]);
    exit();
}

$sqlDelete = "DELETE FROM Comments WHERE commentID = $commentID";
if ($conn->query($sqlDelete) === TRUE) {
    echo json_encode(["success" => true, "message" => "Comment deleted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting comment: " . $conn->error]);
}
?>
