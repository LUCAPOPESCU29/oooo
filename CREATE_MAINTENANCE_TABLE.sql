-- ========================================
-- MAINTENANCE ISSUES TABLE SETUP
-- ========================================
-- Run this in your Supabase SQL Editor
-- ========================================

-- Step 1: Create the table
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_status ON maintenance_issues(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_priority ON maintenance_issues(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_issues_cabin ON maintenance_issues(cabin);

-- Step 3: Enable Row Level Security
ALTER TABLE maintenance_issues ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy to allow all operations
CREATE POLICY "Enable all operations for maintenance_issues" ON maintenance_issues
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 5: Create trigger to auto-update updated_at timestamp
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

-- ========================================
-- VERIFICATION QUERIES (Optional)
-- ========================================
-- Run these to verify the table was created correctly

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'maintenance_issues'
);

-- View table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'maintenance_issues'
ORDER BY ordinal_position;

-- ========================================
-- SUCCESS!
-- ========================================
-- If no errors appeared, your table is ready!
-- Now go back to http://localhost:3000/report-issue and try submitting again
