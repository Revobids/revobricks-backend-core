-- This script renames the real_estate_developer_users table to real_estate_developer_employees
-- Run this script manually in your PostgreSQL database

-- 1. Drop existing foreign key constraints
ALTER TABLE IF EXISTS project_employees 
  DROP CONSTRAINT IF EXISTS "FK_4f5a8429e422b223466e95faf2e";

ALTER TABLE IF EXISTS projects 
  DROP CONSTRAINT IF EXISTS "FK_projectManagerId",
  DROP CONSTRAINT IF EXISTS "FK_salesManagerId";

ALTER TABLE IF EXISTS offices 
  DROP CONSTRAINT IF EXISTS "FK_office_users";

-- 2. Rename the table
ALTER TABLE IF EXISTS real_estate_developer_users 
  RENAME TO real_estate_developer_employees;

-- 3. Recreate foreign key constraints with new table name
ALTER TABLE project_employees 
  ADD CONSTRAINT "FK_project_employees_employee" 
  FOREIGN KEY ("employeeId") 
  REFERENCES real_estate_developer_employees(id) 
  ON DELETE CASCADE;

ALTER TABLE projects 
  ADD CONSTRAINT "FK_projects_projectManager" 
  FOREIGN KEY ("projectManagerId") 
  REFERENCES real_estate_developer_employees(id),
  ADD CONSTRAINT "FK_projects_salesManager" 
  FOREIGN KEY ("salesManagerId") 
  REFERENCES real_estate_developer_employees(id);

-- Note: You may need to run the application with synchronize=true once after this 
-- to let TypeORM create any new constraints or columns