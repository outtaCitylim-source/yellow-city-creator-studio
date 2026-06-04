import { getAll } from '../utils/db.js';
import { authMiddleware, setCorsHeaders, handleCorsPreFlight, errorResponse, successResponse } from '../utils/middleware.js';

async function handler(req, res) {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (handleCorsPreFlight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { status, customerId, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM orders';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (customerId) {
      conditions.push(`customer_id = $${params.length + 1}`);
      params.push(parseInt(customerId));
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const orders = await getAll(query, params);

    return successResponse(res, {
      orders,
      count: orders.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Orders list error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}

export default authMiddleware(handler);
