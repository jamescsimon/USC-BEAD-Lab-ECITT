-- Fix "Select Test" dropdown issue
-- This script ensures admin user has the required permissions to see tests
-- Run this in MySQL Workbench if the dropdown is empty

USE ecitt_db;

-- Check current state
SELECT 'Current test specs:' as Status;
SELECT * FROM ecitt_testSpec;

SELECT 'Current admin permissions:' as Status;
SELECT * FROM ecitt_perm WHERE userName = 'admin';

-- Ensure admin user exists (create if missing)
INSERT INTO ecitt_user (name, password, userType) 
VALUES ('admin', 'admin', 'dev')
ON DUPLICATE KEY UPDATE userType = 'dev';

-- Delete any existing admin permissions to avoid duplicates
DELETE FROM ecitt_perm WHERE userName = 'admin';

-- Create global admin permission (this allows access to all tests)
-- The 'every' field = 1 means the user has access to all entities of this type
INSERT INTO ecitt_perm (userName, entityType, every, entityNo, permName) 
VALUES ('admin', 'global', 1, NULL, 'adm');

-- Verify the fix by running the actual query the app uses
SELECT 'Test query result (what the app should see):' as Status;
SELECT 
    t.no, 
    t.name, 
    t.specName as value, 
    any_value(perm.permName) as perm 
FROM ecitt_testSpec t, ecitt_perm perm 
WHERE perm.userName = 'admin' 
  AND (perm.entityType = 'global' 
       OR (perm.entityType = 'test' 
           AND (perm.every = 1 
                OR t.no = perm.entityNo))) 
GROUP BY t.no, t.name, t.specName 
ORDER BY t.name;

-- If the above query returns rows, the dropdown should work after refreshing the page
