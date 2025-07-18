CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Add some sample data
INSERT INTO users (email, name) VALUES
  ('admin@example.com', 'Admin User'),
  ('user@example.com', 'Regular User'); 