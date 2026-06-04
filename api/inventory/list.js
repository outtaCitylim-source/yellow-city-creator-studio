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
    const { lowStockOnly, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM inventory';
    const params = [];

    if (lowStockOnly === 'true') {
      query += ' WHERE stock <= reorder_level';
    }

    query += ' ORDER BY sku ASC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const inventory = await getAll(query, params);

    return successResponse(res, {
      inventory,
      count: inventory.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Inventory list error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}

export default authMiddleware(handler);
