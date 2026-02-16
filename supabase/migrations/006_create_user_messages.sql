-- Create user_messages table for admin messaging system
CREATE TABLE IF NOT EXISTS user_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  user_name TEXT,
  user_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  booking_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_messages_status ON user_messages(status);
CREATE INDEX IF NOT EXISTS idx_user_messages_created_at ON user_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_messages_email ON user_messages(user_email);

-- Enable Row Level Security
ALTER TABLE user_messages ENABLE ROW LEVEL SECURITY;

-- Admin can see all messages
CREATE POLICY "Admin can view all messages"
  ON user_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.email = auth.jwt()->>'email'
      AND users.role = 'admin'
    )
  );

-- Admin can update message status
CREATE POLICY "Admin can update messages"
  ON user_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.email = auth.jwt()->>'email'
      AND users.role = 'admin'
    )
  );

-- Anyone can insert messages (for guest contact)
CREATE POLICY "Anyone can create messages"
  ON user_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
