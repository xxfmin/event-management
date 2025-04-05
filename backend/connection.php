<?php
// connection.php: Establishes a connection to the MySQL database.
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "sys";

// Create connection using MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
