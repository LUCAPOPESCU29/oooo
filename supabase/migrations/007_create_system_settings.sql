-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  -- Pricing Settings
  cleaning_fee DECIMAL(10, 2) DEFAULT 50,
  service_fee_percentage DECIMAL(5, 2) DEFAULT 10,
  tax_vat_percentage DECIMAL(5, 2) DEFAULT 19,
  currency VARCHAR(10) DEFAULT 'RON',
  
  -- Booking Rules
  minimum_booking_days INTEGER DEFAULT 2,
  maximum_booking_days INTEGER DEFAULT 30,
  advance_booking_limit_days INTEGER DEFAULT 365,
  
  -- Check-in & Check-out
  check_in_time TIME DEFAULT '15:00',
  check_out_time TIME DEFAULT '11:00',
  
  -- Payment Settings
  require_deposit BOOLEAN DEFAULT false,
  deposit_amount_percentage DECIMAL(5, 2) DEFAULT 30,
  accept_credit_debit BOOLEAN DEFAULT true,
  accept_bank_transfer BOOLEAN DEFAULT true,
  accept_cash BOOLEAN DEFAULT false,
  
  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(255)
);

-- Insert default settings
INSERT INTO system_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_system_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_system_settings_timestamp ON system_settings;
CREATE TRIGGER update_system_settings_timestamp
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_timestamp();

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin can manage system settings"
  ON system_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Users can read settings
CREATE POLICY "Users can read system settings"
  ON system_settings
  FOR SELECT
  USING (true);
