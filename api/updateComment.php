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
$newCommentText = $conn->real_escape_string($_POST['commentText'] ?? '');

if ($commentID <= 0 || empty($newCommentText)) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit();
}

$sqlCheck = "SELECT * FROM Comments WHERE commentID = $commentID AND userID = $userID";
$result = $conn->query($sqlCheck);
if ($result->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Not authorized to edit this comment."]);
    exit();
}

$sqlUpdate = "UPDATE Comments SET commentText = '$newCommentText' WHERE commentID = $commentID";
if ($conn->query($sqlUpdate) === TRUE) {
    echo json_encode(["success" => true, "message" => "Comment updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating comment: " . $conn->error]);
}
?>
