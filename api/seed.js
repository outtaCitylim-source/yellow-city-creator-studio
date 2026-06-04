import { query } from './utils/db.js';
import { hashPassword } from './utils/password.js';

async function seedDatabase() {
  try {
    console.log('Seeding database with initial data...');

    // Create admin user
    const adminPassword = hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
    await query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [process.env.ADMIN_EMAIL || 'admin@yellowcity.local', adminPassword, 'Admin User']
    );

    console.log('✓ Admin user created');

    // Insert sample customers
    const customers = [
      { name: 'Walk-In Rush Customer', segment: 'Walk-in', email: null, phone: null },
      { name: 'Local Team Order', segment: 'Team', email: 'team@example.com', phone: '(806) 555-0001' },
      { name: 'Business Uniform Account', segment: 'Business', email: 'business@example.com', phone: '(806) 555-0002' },
      { name: 'Graduation Order', segment: 'Graduation', email: 'grad@example.com', phone: '(806) 555-0003' },
      { name: 'Event Merch Order', segment: 'Event', email: 'event@example.com', phone: '(806) 555-0004' },
    ];

    for (const customer of customers) {
      await query(
        `INSERT INTO customers (name, segment, email, phone)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [customer.name, customer.segment, customer.email, customer.phone]
      );
    }

    console.log('✓ Sample customers created');

    // Insert sample inventory
    const inventory = [
      { sku: 'G500-BLK', item_name: 'Gildan Heavy Cotton Tee', color: 'Black', stock: 128, reorder_level: 60, unit_price: 3.50 },
      { sku: 'BC3001-WHT', item_name: 'Bella+Canvas 3001', color: 'White', stock: 42, reorder_level: 50, unit_price: 4.50 },
      { sku: 'CC1717-PEP', item_name: 'Comfort Colors 1717', color: 'Pepper', stock: 18, reorder_level: 30, unit_price: 5.00 },
      { sku: 'NL6210-NAV', item_name: 'Next Level CVC Tee', color: 'Navy', stock: 67, reorder_level: 45, unit_price: 4.75 },
      { sku: 'YC-DTF-22', item_name: 'DTF Film Roll', color: 'Cold Peel', stock: 4, reorder_level: 6, unit_price: 12.00 },
    ];

    for (const item of inventory) {
      await query(
        `INSERT INTO inventory (sku, item_name, color, stock, reorder_level, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (sku) DO NOTHING`,
        [item.sku, item.item_name, item.color, item.stock, item.reorder_level, item.unit_price]
      );
    }

    console.log('✓ Sample inventory created');

    // Insert sample orders
    const orders = [
      { order_number: 'YCCT-0012', customer_id: 1, method: 'DTF', quantity: 36, total: 420, status: 'New' },
      { order_number: 'YCCT-0011', customer_id: 2, method: 'DTF', quantity: 72, total: 965, status: 'Proof Sent' },
      { order_number: 'YCCT-0010', customer_id: 3, method: 'DTG', quantity: 18, total: 705, status: 'In Production' },
      { order_number: 'YCCT-0009', customer_id: 4, method: 'Embroidery', quantity: 44, total: 1180, status: 'Quality Check' },
      { order_number: 'YCCT-0008', customer_id: 5, method: 'DTF', quantity: 12, total: 204.50, status: 'Ready' },
    ];

    for (const order of orders) {
      await query(
        `INSERT INTO orders (order_number, customer_id, method, quantity, total, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (order_number) DO NOTHING`,
        [order.order_number, order.customer_id, order.method, order.quantity, order.total, order.status]
      );
    }

    console.log('✓ Sample orders created');

    console.log('✓ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
