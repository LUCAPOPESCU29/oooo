-- Create maintenance_issues table
CREATE TABLE IF NOT EXISTS maintenance_issues (
  id BIGSERIAL PRIMARY KEY,
  cabin TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  reported_by TEXT NOT NULL,
  reported_by_email TEXT NOT NULL,
  assigned_to TEXT,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_status ON maintenance_issues(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_priority ON maintenance_issues(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_cabin ON maintenance_issues(cabin);

-- Enable Row Level Security
ALTER TABLE maintenance_issues ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your auth setup)
CREATE POLICY "Enable all operations for maintenance_issues" ON maintenance_issues
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_maintenance_issues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_maintenance_issues_timestamp
BEFORE UPDATE ON maintenance_issues
FOR EACH ROW
EXECUTE FUNCTION update_maintenance_issues_updated_at();
