-- Drop the index first
DROP INDEX IF EXISTS idx_users_is_active;

-- Remove the columns from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS birth_date,
DROP COLUMN IF EXISTS is_active,
DROP COLUMN IF EXISTS last_login; 