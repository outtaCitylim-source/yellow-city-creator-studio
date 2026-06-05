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
    success: false,
    error: message,
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

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const requestCounts = new Map();

export function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;

  if (!requestCounts.has(key)) {
    requestCounts.set(key, 0);
  }

  const count = requestCounts.get(key);
  if (count >= maxRequests) {
    return { allowed: false, retryAfter: windowMs };
  }

  requestCounts.set(key, count + 1);

  // Cleanup old entries
  if (requestCounts.size > 1000) {
    const cutoff = now - windowMs * 2;
    for (const [k] of requestCounts) {
      const timestamp = parseInt(k.split(':')[1], 10) * windowMs;
      if (timestamp < cutoff) {
        requestCounts.delete(k);
      }
    }
  }

  return { allowed: true };
}

/**
 * Validate request method
 */
export function validateMethod(req, allowedMethods) {
  return allowedMethods.includes(req.method);
}

/**
 * Validate content type
 */
export function validateContentType(req, expectedType = 'application/json') {
  const contentType = req.headers['content-type'];
  return contentType && contentType.includes(expectedType);
}

/**
 * Parse JSON body safely
 */
export async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
      // Prevent large payloads (1MB limit)
      if (body.length > 1e6) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

/**
 * Log API request
 */
export function logRequest(req, method, endpoint) {
  const timestamp = new Date().toISOString();
  const userAgent = req.headers['user-agent'] || 'Unknown';
  console.log(`[${timestamp}] ${method} ${endpoint} - ${userAgent}`);
}

/**
 * Log API error
 */
export function logError(error, endpoint) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR at ${endpoint}:`, error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', error.stack);
  }
}

export default {
  authMiddleware,
  errorResponse,
  successResponse,
  setCorsHeaders,
  handleCorsPreFlight,
  checkRateLimit,
  validateMethod,
  validateContentType,
  parseBody,
  logRequest,
  logError,
};
