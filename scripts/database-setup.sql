-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255) NOT NULL,
  mother_name VARCHAR(255) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin settings table
CREATE TABLE admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upi_id VARCHAR(255),
  merchant_name VARCHAR(255),
  payment_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  organization VARCHAR(255),
  location VARCHAR(255),
  qualification VARCHAR(500),
  experience VARCHAR(255),
  salary VARCHAR(255),
  last_date DATE,
  application_fee DECIMAL(10,2) DEFAULT 0,
  external_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job applications table
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  application_data JSONB,
  documents JSONB,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  application_id UUID REFERENCES job_applications(id),
  document_type VARCHAR(100),
  file_name VARCHAR(255),
  file_path TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  application_id UUID REFERENCES job_applications(id),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- OTP verification table
CREATE TABLE otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(15),
  otp VARCHAR(6),
  expires_at TIMESTAMP,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin settings
INSERT INTO admin_settings (upi_id, merchant_name, payment_enabled) 
VALUES ('admin@paytm', 'Cyber Cafe', TRUE);
