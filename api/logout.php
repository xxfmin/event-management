<?php
// API endpoint for logging out
session_start();
header("Content-Type: application/json");
session_destroy();
echo json_encode(["success" => true, "message" => "Logged out successfully."]);
?>
