-- ========================================
-- USERS TABLE AND ADMIN ACCOUNT SETUP
-- ========================================
-- Run this in your Supabase SQL Editor
-- ========================================

-- Step 1: Create the users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Step 3: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy to allow all operations
CREATE POLICY "Enable all operations for users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 5: Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Step 6: Insert admin user
-- Password: admin123 (hashed with bcrypt)
-- The hash below is for "admin123"
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'admin@aframecabins.com',
  '$2a$10$YQ7Ge8xW0qZQxJhXJ0J6/.rF9Z8lX4XGvKJQqJYJYYvKx4Z5XQ3Zu',
  'Admin User',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES (Optional)
-- ========================================

-- Check if users table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'users'
);

-- View admin user
SELECT id, email, full_name, role, created_at
FROM users
WHERE email = 'admin@aframecabins.com';

-- ========================================
-- SUCCESS!
-- ========================================
-- Admin credentials:
-- Email: admin@aframecabins.com
-- Password: admin123
--
-- You can now sign in at http://localhost:3000/signin
