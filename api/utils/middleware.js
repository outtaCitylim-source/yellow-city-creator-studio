import { extractToken, verifyToken } from './jwt.js';

/**
 * Middleware to verify JWT token
 */
export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const token = extractToken(req.headers.authorization);

      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No token provided',
        });
      }

      const decoded = verifyToken(token);
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      });
    }
  };
}

/**
 * Error response handler
 */
export function errorResponse(res, statusCode, message, details = null) {
  return res.status(statusCode).json({
    error: true,
    message,
    ...(details && { details }),
  });
}

/**
 * Success response handler
 */
export function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * CORS headers
 */
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_API_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleCorsPreFlight(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).end();
  }
  return null;
}
