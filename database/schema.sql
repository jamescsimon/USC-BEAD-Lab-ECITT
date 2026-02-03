CREATE TABLE ecitt_part (
  userName varchar(16) DEFAULT NULL,
  no int(11) DEFAULT NULL,
  projectNo int(11) DEFAULT NULL,
  ref varchar(32) DEFAULT NULL,
  birthYear int(11) DEFAULT NULL,
  birthMonth int(11) DEFAULT NULL,
  birthDay int(11) DEFAULT NULL,
  gender varchar(16) DEFAULT NULL
)

CREATE TABLE ecitt_perm (
  userName varchar(16) DEFAULT NULL,
  entityType varchar(16) DEFAULT NULL,
  every tinyint(1) DEFAULT NULL,
  entityNo int(11) DEFAULT NULL,
  permName varchar(16) DEFAULT NULL
)

CREATE TABLE ecitt_project (
  no int(11) DEFAULT NULL,
  name varchar(32) DEFAULT NULL
)

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
)

CREATE TABLE ecitt_testSet (
  no int(11) DEFAULT NULL,
  projectNo int(11) DEFAULT NULL,
  name varchar(32) DEFAULT NULL
)

CREATE TABLE ecitt_testSpec (
  no int(11) DEFAULT NULL,
  name varchar(16) DEFAULT NULL,
  specName varchar(16) DEFAULT NULL
)

CREATE TABLE ecitt_user (
  name varchar(16) DEFAULT NULL,
  password varchar(16) DEFAULT NULL,
  userType varchar(16) DEFAULT NULL
)
