# Database Quick Start Guide

## Problem: Blank dropdowns and 500 errors

**Cause**: MySQL database tables don't exist or are empty.

**Solution**: Run the database setup script.

---

## Setup Steps

### Option 1: MySQL Command Line (Recommended)

1. **Open MySQL Command Line Client as root**
   ```
   mysql -u root -p
   ```

2. **Run the setup script**
   ```sql
   source D:/coding/BEAD Lab/Work/USC-BEAD-Lab-ECITT/database_setup.sql
   ```

3. **Exit MySQL**
   ```sql
   exit;
   ```

### Option 2: MySQL Workbench

1. Open MySQL Workbench
2. Connect as root user
3. Click **File → Open SQL Script**
4. Navigate to: `D:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\database_setup.sql`
5. Click **Execute** (lightning bolt icon)
6. Verify you see "DATABASE SETUP COMPLETE!" message

---

## What the Script Creates

✅ **Database**: `ecitt_db`  
✅ **User**: `ecitt_user` (password: `We_are_1017!`)  
✅ **Tables**: user, perm, project, testSet, part, testSpec, resp  
✅ **Admin Account**: username `admin`, password `admin`  
✅ **Sample Project**: "Sample_Project" with 2 test sets  

---

## After Setup

1. **Stop the PHP server** (Ctrl+C in the terminal where run.bat is running)
2. **Restart the server**:
   ```
   cd "D:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT"
   .\run.bat
   ```
3. **Open controller**: http://localhost:8000/controller
4. **Login**: admin / admin
5. **You should now see "Sample_Project" in the dropdown**

---

## Troubleshooting

### Error: "Access denied for user 'ecitt_user'"
- Make sure you ran the script as **root** user
- The script creates the `ecitt_user` automatically

### Error: "Database connection failed"
- Check MySQL is running: `mysql --version`
- On Windows: Check Services → MySQL is started

### Still seeing blank dropdowns?
- Check the browser console for errors
- Refresh the page (Ctrl+F5)
- Check database has data:
  ```sql
  USE ecitt_db;
  SELECT * FROM ecitt_project;
  ```

### Error: "Pattern attribute value is not a valid regular expression"
- This has been fixed in the code (regex pattern corrected)
- Restart the PHP server for the fix to take effect
