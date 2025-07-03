-- Update jobs table with additional fields
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Other';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posts INTEGER DEFAULT 1;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility JSONB DEFAULT '[]';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_start DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS exam_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience VARCHAR(255);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_last_date ON jobs(last_date);

-- Insert sample jobs with enhanced data
INSERT INTO jobs (
  title, organization, location, qualification, experience, salary, 
  last_date, application_fee, external_url, category, posts, description, 
  eligibility, application_start, exam_date
) VALUES
(
  'Staff Selection Commission - Multi Tasking Staff (MTS)',
  'Staff Selection Commission',
  'All India',
  'Matriculation (10th Pass) from recognized board',
  'No experience required',
  '₹18,000 - ₹22,000 per month',
  '2024-03-15',
  100.00,
  'https://ssc.nic.in',
  'Central Government',
  8000,
  'Staff Selection Commission invites applications for Multi Tasking Staff positions across various government departments. The selected candidates will be responsible for general maintenance, cleaning, and basic administrative tasks.',
  '["Age: 18-25 years (relaxation as per govt rules)", "Education: 10th pass from recognized board", "Physical fitness required for some posts"]',
  '2024-02-01',
  '2024-04-20'
),
(
  'Railway Recruitment Board - Assistant Loco Pilot',
  'Indian Railways',
  'All India',
  'ITI/Diploma in relevant trade',
  '0-3 years',
  '₹35,000 - ₹40,000 per month',
  '2024-03-20',
  500.00,
  'https://rrbcdg.gov.in',
  'Railway',
  5000,
  'Indian Railways is recruiting Assistant Loco Pilots for various railway zones across India. Candidates will assist in train operations and maintenance activities.',
  '["Age: 18-28 years", "ITI in relevant trade OR Diploma in Engineering", "Medical fitness as per railway standards"]',
  '2024-02-05',
  '2024-05-15'
) ON CONFLICT (id) DO NOTHING;
