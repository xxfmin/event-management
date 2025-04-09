<?php
session_start();
header("Content-Type: application/json");
include 'connection.php';

if (!isset($_SESSION['userID']) || $_SESSION['userType'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

$name = $conn->real_escape_string($_POST['name'] ?? '');
$description = $conn->real_escape_string($_POST['description'] ?? '');
$adminID = intval($_SESSION['userID']);

// Retrieve the four extra member usernames from the form
$member1 = trim($_POST['member1'] ?? '');
$member2 = trim($_POST['member2'] ?? '');
$member3 = trim($_POST['member3'] ?? '');
$member4 = trim($_POST['member4'] ?? '');

// Validate that the RSO name is provided
if (!$name) {
    echo json_encode(["success" => false, "message" => "RSO name is required."]);
    exit();
}

// Enforce that all 4 extra member fields must be filled
if (!$member1 || !$member2 || !$member3 || !$member4) {
    echo json_encode(["success" => false, "message" => "All four extra member usernames are required."]);
    exit();
}

// Optional: Validate usernames further if desired (e.g., check for valid format or length)
// For now, we assume the input is correct.

// Create the RSO
$sql = "INSERT INTO RSOs (name, description, adminID) VALUES ('$name', '$description', $adminID)";
if ($conn->query($sql) === TRUE) {
    $rsoID = $conn->insert_id;
    
    // Add the admin as the first member of the RSO.
    $membershipSql = "INSERT INTO Students_RSO (userID, rsoID) VALUES ($adminID, $rsoID)";
    if ($conn->query($membershipSql) !== TRUE) {
        echo json_encode(["success" => false, "message" => "RSO created but failed to add admin: " . $conn->error]);
        exit();
    }
    
    $validMembersCount = 1; // Count admin as first member

    // Store the four extra member usernames in an array for processing.
    $memberUsernames = [$member1, $member2, $member3, $member4];

    foreach ($memberUsernames as $username) {
        $usernameEsc = $conn->real_escape_string($username);
        // Look up user by username in the Users table
        $findUserSql = "SELECT userID FROM Users WHERE username='$usernameEsc' LIMIT 1";
        $findUserRes = $conn->query($findUserSql);
        if ($findUserRes && $findUserRes->num_rows > 0) {
            $userRow = $findUserRes->fetch_assoc();
            $memberUserID = $userRow['userID'];
            // Check if this user is already a member of the RSO
            $checkMembershipSql = "SELECT membershipID FROM Students_RSO WHERE userID=$memberUserID AND rsoID=$rsoID";
            $checkMembershipRes = $conn->query($checkMembershipSql);
            if (!$checkMembershipRes || $checkMembershipRes->num_rows === 0) {
                $insertMemberSql = "INSERT INTO Students_RSO (userID, rsoID) VALUES ($memberUserID, $rsoID)";
                if ($conn->query($insertMemberSql) === TRUE) {
                    $validMembersCount++;
                }
            }
        }
    }
    
    // (Optional) Enforce that a minimum number of members is present (e.g., admin + 4 extra = 5 total)
    if ($validMembersCount < 5) {
        echo json_encode(["success" => false, "message" => "RSO created but some extra members could not be added (insufficient valid extra members)."]);
    } else {
        echo json_encode(["success" => true, "message" => "RSO created successfully and all members added."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}
?>
