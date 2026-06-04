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
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      garment,
      method,
      quantity,
      deadline,
      artworkStatus,
      placement,
      estimatedTotal,
    } = req.body;

    // Validate input
    if (!customerName || !method || !quantity) {
      return errorResponse(res, 400, 'Missing required fields: customerName, method, quantity');
    }

    // Generate quote number
    const quoteNumber = `QT-${Date.now().toString().slice(-5)}`;

    // Insert quote
    const result = await query(
      `INSERT INTO quotes (
        quote_number, customer_id, customer_name, customer_email, customer_phone,
        garment, method, quantity, deadline, artwork_status, placement, estimated_total, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Draft')
       RETURNING *`,
      [
        quoteNumber,
        customerId || null,
        customerName,
        customerEmail || null,
        customerPhone || null,
        garment || null,
        method,
        quantity,
        deadline || null,
        artworkStatus || null,
        placement || null,
        estimatedTotal || null,
      ]
    );

    const quote = result.rows[0];

    return successResponse(res, quote, 201);
  } catch (error) {
    console.error('Quote creation error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}

export default authMiddleware(handler);
