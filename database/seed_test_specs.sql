-- Seed ecitt_testSpec (populates "Select Test" dropdown in Controller).
-- Run this if the Select Test dropdown is empty. Use database ecitt_db.

USE ecitt_db;

DELETE FROM ecitt_testSpec;
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
