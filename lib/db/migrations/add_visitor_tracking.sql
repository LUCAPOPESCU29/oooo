-- Add Visitor Tracking Table
-- This table stores IP addresses and visit information for analytics

CREATE TABLE IF NOT EXISTS visitor_logs (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,  -- IPv4 (15 chars) or IPv6 (45 chars)
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  visit_count INTEGER DEFAULT 1,
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_visitor_ip ON visitor_logs(ip_address);
CREATE INDEX idx_visitor_last_visit ON visitor_logs(last_visit);
CREATE INDEX idx_visitor_country ON visitor_logs(country);

-- Update schema to track IPs in bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

-- Create index for booking IPs
CREATE INDEX IF NOT EXISTS idx_bookings_ip ON bookings(ip_address);
