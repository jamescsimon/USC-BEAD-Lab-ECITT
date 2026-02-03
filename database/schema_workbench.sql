-- ECITT Web App Database Schema
-- For MySQL Workbench Import

-- Create database (uncomment if you want to create it here, or create manually in Workbench)
-- CREATE DATABASE IF NOT EXISTS ecitt_db;
-- USE ecitt_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS ecitt_resp;
DROP TABLE IF EXISTS ecitt_part;
DROP TABLE IF EXISTS ecitt_testSet;
DROP TABLE IF EXISTS ecitt_testSpec;
DROP TABLE IF EXISTS ecitt_project;
DROP TABLE IF EXISTS ecitt_perm;
DROP TABLE IF EXISTS ecitt_user;

-- Create tables
CREATE TABLE ecitt_user (
  name varchar(16) DEFAULT NULL,
  password varchar(16) DEFAULT NULL,
  userType varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ecitt_perm (
  userName varchar(16) DEFAULT NULL,
  entityType varchar(16) DEFAULT NULL,
  every tinyint(1) DEFAULT NULL,
  entityNo int(11) DEFAULT NULL,
  permName varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ecitt_project (
  no int(11) DEFAULT NULL,
  name varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ecitt_testSet (
  no int(11) DEFAULT NULL,
  projectNo int(11) DEFAULT NULL,
  name varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ecitt_testSpec (
  no int(11) DEFAULT NULL,
  name varchar(16) DEFAULT NULL,
  specName varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ecitt_part (
  userName varchar(16) DEFAULT NULL,
  no int(11) DEFAULT NULL,
  projectNo int(11) DEFAULT NULL,
  ref varchar(32) DEFAULT NULL,
  birthYear int(11) DEFAULT NULL,
  birthMonth int(11) DEFAULT NULL,
  birthDay int(11) DEFAULT NULL,
  gender varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ecitt_resp (
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
  partRef varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert a default admin user (optional)
-- Password: admin (you should change this!)
-- IMPORTANT: userType must be 'dev', 'user', or 'demo' (NOT 'admin') for login to work
-- The JavaScript only accepts these three userType values
INSERT INTO ecitt_user (name, password, userType) VALUES ('admin', 'admin', 'dev');
INSERT INTO ecitt_perm (userName, entityType, every, entityNo, permName) 
VALUES ('admin', 'global', 1, NULL, 'adm');

-- Seed test specs (matches controller test list in cntr.xml; populates "Select Test" dropdown)
INSERT INTO ecitt_testSpec (no, name, specName) VALUES
(1, 'Prohibition', 'phb'),
(2, '9 Months', '9m'),
(3, 'Box Test', 'box'),
(4, 'Box Test 3-1', 'box31'),
(5, '24 Months 1', '24m1'),
(6, '24 Months 2', '24m2'),
(7, '24 Months 2 Hor', '24m2h'),
(8, '48 Months', '48m'),
(9, 'Dev', 'dev'),
(10, 'NIRS Ver', 'nirsv'),
(11, 'Nirs Hor', 'nirsh'),
(12, '48 Months Nirs', '48mn'),
(13, 'Adult', 'adt'),
(14, 'Adult Hor', 'adth'),
(15, 'Spatial Confl', 'spc');

