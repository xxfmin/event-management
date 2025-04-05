-- database.sql

USE event-management;

-- Drop tables if they exist
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Students_RSO;
DROP TABLE IF EXISTS RSOs;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Universities;

-- Create Universities table
CREATE TABLE Universities (
    universityID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    num_students INT,
    picture VARCHAR(255)
);

-- Create Users table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    userType ENUM('superadmin', 'admin', 'student') NOT NULL,
    universityID INT,
    FOREIGN KEY (universityID) REFERENCES Universities(universityID)
);

-- Create RSOs table
CREATE TABLE RSOs (
    rsoID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    universityID INT,
    status ENUM('active', 'inactive') DEFAULT 'inactive',
    adminID INT,
    FOREIGN KEY (universityID) REFERENCES Universities(universityID),
    FOREIGN KEY (adminID) REFERENCES Users(userID)
);

-- Create Students_RSO table (membership)
CREATE TABLE Students_RSO (
    membershipID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    rsoID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (rsoID) REFERENCES RSOs(rsoID)
);

-- Create Locations table
CREATE TABLE Locations (
    locationID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6)
);

-- Create Events table
CREATE TABLE Events (
    eventID INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    eventCategory VARCHAR(50),
    description TEXT,
    eventDate DATE,
    startTime TIME,
    endTime TIME,
    locationID INT,
    contactPhone VARCHAR(20),
    contactEmail VARCHAR(100),
    createdBy INT, -- user who created the event (admin)
    approvedBy INT, -- superadmin approval for public events (nullable)
    rsoID INT, -- nullable, for RSO events
    eventType ENUM('public', 'private', 'rso') NOT NULL,
    FOREIGN KEY (locationID) REFERENCES Locations(locationID),
    FOREIGN KEY (createdBy) REFERENCES Users(userID),
    FOREIGN KEY (approvedBy) REFERENCES Users(userID),
    FOREIGN KEY (rsoID) REFERENCES RSOs(rsoID)
);

-- Create Comments table
CREATE TABLE Comments (
    commentID INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT,
    userID INT,
    commentText TEXT,
    commentTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventID) REFERENCES Events(eventID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Create Ratings table
CREATE TABLE Ratings (
    ratingID INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT,
    userID INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (eventID) REFERENCES Events(eventID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Trigger: After a student joins an RSO, if membership count >= 5 then set status to 'active'.
DELIMITER $$
CREATE TRIGGER RSOStatusUpdateAfterInsert
AFTER INSERT ON Students_RSO
FOR EACH ROW
BEGIN
    DECLARE memberCount INT;
    SELECT COUNT(*) INTO memberCount FROM Students_RSO WHERE rsoID = NEW.rsoID;
    IF memberCount >= 5 THEN
        UPDATE RSOs SET status = 'active' WHERE rsoID = NEW.rsoID;
    END IF;
END$$
DELIMITER ;

-- Trigger: After a student leaves an RSO, if membership count < 5 then set status to 'inactive'.
DELIMITER $$
CREATE TRIGGER RSOStatusUpdateAfterDelete
AFTER DELETE ON Students_RSO
FOR EACH ROW
BEGIN
    DECLARE memberCount INT;
    SELECT COUNT(*) INTO memberCount FROM Students_RSO WHERE rsoID = OLD.rsoID;
    IF memberCount < 5 THEN
        UPDATE RSOs SET status = 'inactive' WHERE rsoID = OLD.rsoID;
    END IF;
END$$
DELIMITER ;

-- Insert sample data
INSERT INTO Universities (name, location, description, num_students, picture)
VALUES ('UCF', 'Orlando, FL', 'University of Central Florida', 60000, 'ucf.png');

INSERT INTO Users (username, password, email, userType, universityID)
VALUES 
('superadmin', MD5('password'), 'superadmin@ucf.edu', 'superadmin', 1),
('admin1', MD5('password'), 'admin1@ucf.edu', 'admin', 1),
('student1', MD5('password'), 'student1@ucf.edu', 'student', 1),
('student2', MD5('password'), 'student2@ucf.edu', 'student', 1),
('student3', MD5('password'), 'student3@ucf.edu', 'student', 1),
('student4', MD5('password'), 'student4@ucf.edu', 'student', 1),
('student5', MD5('password'), 'student5@ucf.edu', 'student', 1);

INSERT INTO RSOs (name, description, universityID, adminID)
VALUES ('Tech Club', 'Technology enthusiasts club', 1, 2);

-- Add memberships (to trigger RSO activation when there are at least 5 members)
INSERT INTO Students_RSO (userID, rsoID) VALUES (3, 1);
INSERT INTO Students_RSO (userID, rsoID) VALUES (4, 1);
INSERT INTO Students_RSO (userID, rsoID) VALUES (5, 1);
INSERT INTO Students_RSO (userID, rsoID) VALUES (6, 1);
INSERT INTO Students_RSO (userID, rsoID) VALUES (7, 1);

-- Insert a sample location
INSERT INTO Locations (name, address, latitude, longitude)
VALUES ('Main Campus Center', '4000 Central Florida Blvd, Orlando, FL', 28.6024, -81.2001);

-- Insert a sample public event (requires superadmin approval)
INSERT INTO Events (eventName, eventCategory, description, eventDate, startTime, endTime, locationID, contactPhone, contactEmail, createdBy, eventType)
VALUES ('Campus Fair', 'social', 'Annual campus fair event', '2025-05-10', '10:00:00', '12:00:00', 1, '4071234567', 'contact@ucf.edu', 2, 'public');

-- Insert a sample RSO event
INSERT INTO Events (eventName, eventCategory, description, eventDate, startTime, endTime, locationID, contactPhone, contactEmail, createdBy, rsoID, eventType)
VALUES ('Tech Talk', 'tech talks', 'Discussion on emerging tech', '2025-05-15', '14:00:00', '16:00:00', 1, '4077654321', 'tech@ucf.edu', 2, 1, 'rso');

-- Insert a sample comment for event 1
INSERT INTO Comments (eventID, userID, commentText)
VALUES (1, 3, 'Looking forward to this event!');

-- Insert a sample rating for event 1
INSERT INTO Ratings (eventID, userID, rating)
VALUES (1, 3, 4);
