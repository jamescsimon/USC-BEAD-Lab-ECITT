-- ECITT Database Setup Script
-- Run this as MySQL root user to set up the complete database
-- 
-- INSTRUCTIONS:
-- 1. Open MySQL Command Line Client or MySQL Workbench as root
-- 2. Run this entire script: source database_setup.sql
-- 3. Restart the PHP server (run.bat)
-- 4. Login to controller with admin/admin

-- ============================================================
-- STEP 1: Create Database and User
-- ============================================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ecitt_db;

-- Create the user if it doesn't exist
CREATE USER IF NOT EXISTS 'ecitt_user'@'localhost' IDENTIFIED BY 'We_are_1017!';

-- Grant all privileges to the user on the ecitt_db database
GRANT ALL PRIVILEGES ON ecitt_db.* TO 'ecitt_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Switch to the ecitt_db database
USE ecitt_db;

-- ============================================================
-- STEP 2: Create Tables
-- ============================================================

-- User authentication table
CREATE TABLE IF NOT EXISTS ecitt_user (
  name varchar(16) NOT NULL PRIMARY KEY,
  password varchar(16) DEFAULT NULL,
  userType varchar(16) DEFAULT NULL
);

-- Permissions table
CREATE TABLE IF NOT EXISTS ecitt_perm (
  userName varchar(16) DEFAULT NULL,
  entityType varchar(16) DEFAULT NULL,
  every tinyint(1) DEFAULT NULL,
  entityNo int(11) DEFAULT NULL,
  permName varchar(16) DEFAULT NULL,
  KEY idx_username (userName)
);

-- Projects table
CREATE TABLE IF NOT EXISTS ecitt_project (
  no int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(32) DEFAULT NULL
);

-- Test sets table
CREATE TABLE IF NOT EXISTS ecitt_testSet (
  no int(11) NOT NULL AUTO_INCREMENT,
  projectNo int(11) DEFAULT NULL,
  name varchar(32) DEFAULT NULL,
  PRIMARY KEY (no, projectNo),
  KEY idx_project (projectNo)
);

-- Participants table
CREATE TABLE IF NOT EXISTS ecitt_part (
  userName varchar(16) DEFAULT NULL,
  no int(11) NOT NULL AUTO_INCREMENT,
  projectNo int(11) DEFAULT NULL,
  testSetNo int(11) DEFAULT NULL,
  ref varchar(32) DEFAULT NULL,
  birthYear int(11) DEFAULT NULL,
  birthMonth int(11) DEFAULT NULL,
  birthDay int(11) DEFAULT NULL,
  gender varchar(16) DEFAULT NULL,
  PRIMARY KEY (no, projectNo, testSetNo),
  KEY idx_project_testset (projectNo, testSetNo)
);

-- Test specifications table
CREATE TABLE IF NOT EXISTS ecitt_testSpec (
  no int(11) NOT NULL AUTO_INCREMENT,
  name varchar(16) DEFAULT NULL,
  specName varchar(16) DEFAULT NULL,
  PRIMARY KEY (no)
);

-- Response data table (for legacy Google Sheets compatibility)
-- NOTE: Trial response data is now logged to CSV files
-- This table is kept for backward compatibility only
CREATE TABLE IF NOT EXISTS ecitt_resp (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userName varchar(16) DEFAULT NULL,
  projectNo int(11) DEFAULT NULL,
  testSetNo int(11) DEFAULT NULL,
  testName varchar(16) DEFAULT NULL,
  partNo int(11) DEFAULT NULL,
  prevRespTime bigint(20) DEFAULT NULL,
  trialStartTime bigint(20) DEFAULT NULL,
  trialType varchar(16) DEFAULT NULL,
  trialPhase varchar(16) DEFAULT NULL,
  trialNo int(11) DEFAULT NULL,
  trialVariant varchar(16) DEFAULT NULL,
  accuracy int(11) DEFAULT NULL,
  touchTime int(11) DEFAULT NULL,
  reactionTime int(11) DEFAULT NULL,
  trialTime int(11) DEFAULT NULL,
  buttonPressed varchar(16) DEFAULT NULL,
  animationShown varchar(16) DEFAULT NULL,
  dotPressed int(11) DEFAULT NULL,
  moveEvents int(11) DEFAULT NULL,
  hidden int(11) DEFAULT NULL,
  posLat float DEFAULT NULL,
  posLong float DEFAULT NULL,
  trialStartDate date DEFAULT NULL,
  ageMonths int(11) DEFAULT NULL,
  partRef varchar(16) DEFAULT NULL,
  KEY idx_project_testset_part (projectNo, testSetNo, partNo)
);

-- ============================================================
-- STEP 3: Insert Admin User and Permissions
-- ============================================================

-- Delete existing admin user if present (to avoid duplicates)
DELETE FROM ecitt_perm WHERE userName = 'admin';
DELETE FROM ecitt_user WHERE name = 'admin';

-- Create admin user
-- IMPORTANT: userType must be 'dev' (NOT 'admin') for login to work
INSERT INTO ecitt_user (name, password, userType) 
VALUES ('admin', 'admin', 'dev');

-- Create admin permissions (global admin access)
INSERT INTO ecitt_perm (userName, entityType, every, entityNo, permName) 
VALUES ('admin', 'global', 1, NULL, 'adm');

-- ============================================================
-- STEP 4: Insert Sample Data (Projects and Test Sets)
-- ============================================================

-- Insert sample project
INSERT INTO ecitt_project (no, name) VALUES (1, 'Sample_Project');

-- Insert sample test sets for the project
INSERT INTO ecitt_testSet (no, projectNo, name) VALUES (1, 1, 'ECITT_TestSet');
INSERT INTO ecitt_testSet (no, projectNo, name) VALUES (2, 1, 'STAR_TestSet');

-- Insert default test specifications
INSERT INTO ecitt_testSpec (no, name, specName) VALUES 
  (1, '24m2', '24-Month Test v2'),
  (2, 'adt', 'Adult Test'),
  (3, '48m', '48-Month Test');

-- ============================================================
-- STEP 5: Verification Queries
-- ============================================================

-- Display setup completion status
SELECT '==========================' AS '';
SELECT 'DATABASE SETUP COMPLETE!' AS STATUS;
SELECT '==========================' AS '';
SELECT '' AS '';

-- Verify user was created
SELECT 'Admin User:' AS '';
SELECT name, userType FROM ecitt_user WHERE name = 'admin';
SELECT '' AS '';

-- Verify permissions
SELECT 'Admin Permissions:' AS '';
SELECT * FROM ecitt_perm WHERE userName = 'admin';
SELECT '' AS '';

-- Verify projects
SELECT 'Projects:' AS '';
SELECT * FROM ecitt_project;
SELECT '' AS '';

-- Verify test sets
SELECT 'Test Sets:' AS '';
SELECT * FROM ecitt_testSet;
SELECT '' AS '';

-- Show table count
SELECT 'Tables Created:' AS '';
SELECT COUNT(*) AS TableCount FROM information_schema.tables 
WHERE table_schema = 'ecitt_db';

SELECT '==========================' AS '';
SELECT 'You can now:' AS '';
SELECT '1. Restart run.bat' AS '';
SELECT '2. Login with admin/admin' AS '';
SELECT '3. Select Sample_Project' AS '';
SELECT '==========================' AS '';
