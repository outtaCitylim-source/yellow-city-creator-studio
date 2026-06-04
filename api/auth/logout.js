import { setCorsHeaders, handleCorsPreFlight, errorResponse, successResponse } from '../utils/middleware.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (handleCorsPreFlight(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    // Logout is handled on the frontend by removing the token
    // This endpoint is just for symmetry and future use (e.g., token blacklisting)
    return successResponse(res, {
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}
