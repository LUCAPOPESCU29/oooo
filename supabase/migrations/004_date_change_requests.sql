-- Create date_change_requests table
CREATE TABLE IF NOT EXISTS date_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL,
  original_check_in DATE NOT NULL,
  original_check_out DATE NOT NULL,
  requested_check_in DATE NOT NULL,
  requested_check_out DATE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  guest_name TEXT,
  guest_email TEXT,
  cabin_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_date_change_requests_booking ON date_change_requests(booking_reference);
CREATE INDEX idx_date_change_requests_status ON date_change_requests(status);
CREATE INDEX idx_date_change_requests_created_at ON date_change_requests(created_at DESC);

-- Add RLS policies
ALTER TABLE date_change_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for guest requests)
CREATE POLICY "Anyone can create date change requests"
  ON date_change_requests
  FOR INSERT
  WITH CHECK (true);

-- Allow admins to view all requests
CREATE POLICY "Admins can view all date change requests"
  ON date_change_requests
  FOR SELECT
  USING (true);

-- Allow admins to update requests
CREATE POLICY "Admins can update date change requests"
  ON date_change_requests
  FOR UPDATE
  USING (true);
