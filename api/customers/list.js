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
    const { segment, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM customers';
    const params = [];

    if (segment) {
      query += ' WHERE segment = $1';
      params.push(segment);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const customers = await getAll(query, params);

    return successResponse(res, {
      customers,
      count: customers.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Customers list error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}

export default authMiddleware(handler);
