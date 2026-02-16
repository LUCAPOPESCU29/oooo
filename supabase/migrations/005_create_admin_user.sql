-- Create admin user
-- Password: admin123 (hashed with bcrypt)
-- The hash below is for 'admin123'

INSERT INTO users (email, password_hash, full_name, role, created_at)
VALUES (
  'admin@aframecabins.com',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGQjdZBL.I9sJhW93o2YCn6',
  'Admin User',
  'admin',
  NOW()
)
ON CONFLICT (email) DO NOTHING;
