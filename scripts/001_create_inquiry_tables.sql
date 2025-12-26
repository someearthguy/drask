-- Create patient_inquiries table
CREATE TABLE IF NOT EXISTS patient_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'website'
);

-- Create hospital_inquiries table
CREATE TABLE IF NOT EXISTS hospital_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'website'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patient_inquiries_created_at ON patient_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hospital_inquiries_created_at ON hospital_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE patient_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public inserts (for form submissions)
-- Anyone can insert (submit a form)
CREATE POLICY "Allow public inserts on patient_inquiries" 
  ON patient_inquiries 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on hospital_inquiries" 
  ON hospital_inquiries 
  FOR INSERT 
  WITH CHECK (true);

-- Only authenticated users can view inquiries (for admin dashboard later)
CREATE POLICY "Allow authenticated reads on patient_inquiries" 
  ON patient_inquiries 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated reads on hospital_inquiries" 
  ON hospital_inquiries 
  FOR SELECT 
  USING (auth.role() = 'authenticated');
