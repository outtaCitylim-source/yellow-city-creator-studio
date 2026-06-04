import { getOne } from '../utils/db.js';
import { generateToken } from '../utils/jwt.js';
import { verifyPassword } from '../utils/password.js';
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
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    // Find user by email
    const user = await getOne(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return successResponse(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
}
