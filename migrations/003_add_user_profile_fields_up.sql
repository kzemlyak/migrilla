-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN birth_date DATE,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN last_login TIMESTAMP;

-- Create index for active users
CREATE INDEX idx_users_is_active ON users(is_active);

-- Update existing users
UPDATE users SET is_active = TRUE WHERE is_active IS NULL; 