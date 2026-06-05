-- Add payments table for Stripe integration
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, expired, refunded
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);

-- Add email_sent tracking to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_status_email_sent TIMESTAMP;

-- Create email_logs table for tracking
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  email_type VARCHAR(50), -- confirmation, status_update, payment_receipt
  recipient_email VARCHAR(255),
  status VARCHAR(50), -- sent, failed
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Add analytics columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5, 2) DEFAULT 0;

-- Create analytics view
CREATE OR REPLACE VIEW monthly_analytics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value,
  COUNT(CASE WHEN status = 'Picked Up' THEN 1 END) as completed_orders,
  COUNT(CASE WHEN status = 'Picked Up' THEN 1 END)::float / COUNT(*) * 100 as completion_rate
FROM orders
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
