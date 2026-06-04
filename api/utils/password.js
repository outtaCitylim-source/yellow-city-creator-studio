import crypto from 'crypto';

/**
 * Hash a password using PBKDF2
 * Note: In production, consider using bcrypt or argon2
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against its hash
 */
export function verifyPassword(password, passwordHash) {
  const [salt, hash] = passwordHash.split(':');
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}
