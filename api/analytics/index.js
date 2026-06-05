import { getDb } from '../../server/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Get total revenue this month
    const revenueResult = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM orders 
       WHERE created_at >= DATE_TRUNC('month', NOW())`
    );
    const totalRevenue = revenueResult.rows[0]?.total || 0;

    // Get total orders this month
    const ordersResult = await db.query(
      `SELECT COUNT(*) as count FROM orders 
       WHERE created_at >= DATE_TRUNC('month', NOW())`
    );
    const totalOrders = ordersResult.rows[0]?.count || 0;

    // Get average order value
    const avgResult = await db.query(
      `SELECT COALESCE(AVG(total), 0) as avg FROM orders 
       WHERE created_at >= DATE_TRUNC('month', NOW())`
    );
    const avgOrderValue = avgResult.rows[0]?.avg || 0;

    // Get completion rate
    const completedResult = await db.query(
      `SELECT COUNT(*) as count FROM orders 
       WHERE status = 'Picked Up' AND created_at >= DATE_TRUNC('month', NOW())`
    );
    const completedOrders = completedResult.rows[0]?.count || 0;
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    // Revenue trend (last 7 days)
    const trendResult = await db.query(
      `SELECT DATE(created_at) as date, SUM(total) as revenue FROM orders 
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );
    const revenueData = trendResult.rows.map(row => ({
      date: row.date,
      revenue: parseFloat(row.revenue) || 0
    }));

    // Orders by status
    const statusResult = await db.query(
      `SELECT status, COUNT(*) as count FROM orders 
       WHERE created_at >= DATE_TRUNC('month', NOW())
       GROUP BY status
       ORDER BY count DESC`
    );
    const ordersByStatus = statusResult.rows.map(row => ({
      status: row.status,
      count: parseInt(row.count)
    }));

    // Top decoration methods
    const servicesResult = await db.query(
      `SELECT decoration_method, COUNT(*) as count FROM order_items
       WHERE created_at >= DATE_TRUNC('month', NOW())
       GROUP BY decoration_method
       ORDER BY count DESC
       LIMIT 5`
    );
    const topServices = servicesResult.rows.map(row => ({
      name: row.decoration_method,
      value: parseInt(row.count)
    }));

    // Customer segments
    const segmentsResult = await db.query(
      `SELECT segment, COUNT(*) as count FROM customers
       GROUP BY segment
       ORDER BY count DESC`
    );
    const customerSegments = segmentsResult.rows.map(row => ({
      name: row.segment,
      count: parseInt(row.count)
    }));

    res.status(200).json({
      totalRevenue: parseFloat(totalRevenue),
      totalOrders,
      avgOrderValue: parseFloat(avgOrderValue),
      completionRate,
      revenueData,
      ordersByStatus,
      topServices,
      customerSegments,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
}
