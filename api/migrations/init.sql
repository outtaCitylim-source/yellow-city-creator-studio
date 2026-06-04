-- Yellow City Creator Studio - Database Schema
-- PostgreSQL initialization script

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  segment VARCHAR(50) CHECK (segment IN ('Walk-in', 'Team', 'Business', 'Graduation', 'Event')),
  total_spent DECIMAL(10, 2) DEFAULT 0,
  order_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id INT REFERENCES customers(id),
  status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Proof Sent', 'In Production', 'Quality Check', 'Ready', 'Picked Up')),
  method VARCHAR(50) CHECK (method IN ('DTF', 'DTG', 'Embroidery', 'Screen Print', 'Vinyl', 'Mixed')),
  quantity INT,
  total DECIMAL(10, 2),
  due_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  garment VARCHAR(255),
  color VARCHAR(100),
  size VARCHAR(10),
  quantity INT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  color VARCHAR(100),
  stock INT DEFAULT 0,
  reorder_level INT DEFAULT 20,
  unit_price DECIMAL(10, 2),
  supplier VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  quote_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id INT REFERENCES customers(id),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  garment VARCHAR(255),
  method VARCHAR(50),
  quantity INT,
  deadline VARCHAR(100),
  artwork_status VARCHAR(100),
  placement VARCHAR(255),
  estimated_total DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create POS transactions table
CREATE TABLE IF NOT EXISTS pos_transactions (
  id SERIAL PRIMARY KEY,
  transaction_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id INT REFERENCES customers(id),
  items JSONB,
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create kiosk submissions table
CREATE TABLE IF NOT EXISTS kiosk_submissions (
  id SERIAL PRIMARY KEY,
  submission_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  service_type VARCHAR(100),
  details JSONB,
  status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Converted to Order', 'Archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create decoration techniques reference table
CREATE TABLE IF NOT EXISTS techniques (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  base_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(segment);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory(sku);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_created_at ON pos_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_kiosk_submissions_status ON kiosk_submissions(status);

-- Insert default decoration techniques
INSERT INTO techniques (code, label, title, description, base_price) VALUES
  ('DTF', 'Direct to Film', 'DTF Print', 'Full-color photographic prints on many fabrics. Vivid, wash-resistant, and studio-grade.', 16.00),
  ('DTG', 'Direct to Garment', 'DTG Print', 'Ink-style printing directly onto the garment for ultra-soft handfeel on premium blanks.', 18.00),
  ('EMB', 'Embroidery', 'Embroidery', 'Digitized logo embroidery on caps, polos, and jackets for a crisp textured finish.', 24.00),
  ('WASH', 'Garment Wash', 'Garment Dye & Distress', 'Hand-finished dye and distress techniques for one-of-a-kind vintage looks.', 18.00)
ON CONFLICT (code) DO NOTHING;
