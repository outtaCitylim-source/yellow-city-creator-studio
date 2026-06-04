import { query } from '../utils/db.js';
import { authMiddleware, setCorsHeaders, handleCorsPreFlight, errorResponse, successResponse } from '../utils/middleware.js';

async function handler(req, res) {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (handleCorsPreFlight(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { customerId, method, quantity, total, dueDate, notes } = req.body;

    // Validate input
    if (!customerId || !method || !quantity || !total) {
      return errorResponse(res, 400, 'Missing required fields: customerId, method, quantity, total');
    }

    // Generate order number (YCCT-XXXXX)
    const orderNumber = `YCCT-${Date.now().toString().slice(-5)}`;

    // Insert order
    const result = await query(
      `INSERT INTO orders (order_number, customer_id, method, quantity, total, due_date, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'New')
       RETURNING id, order_number, customer_id, method, quantity, total, due_date, notes, status, created_at`,
      [orderNumber, customerId, method, quantity, total, dueDate || null, notes || null]
    );

    const order = result.rows[0];

    return successResponse(res, order, 201);
  } catch (error) {
    console.error('Order creation error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}

export default authMiddleware(handler);
