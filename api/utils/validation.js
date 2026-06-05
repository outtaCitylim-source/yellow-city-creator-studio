/**
 * Input validation utilities for API endpoints
 * Prevents invalid data from reaching the database
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: 8+ chars, at least one number, one letter
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
}

/**
 * Validate order status
 */
export function validateOrderStatus(status) {
  const validStatuses = ['New', 'Proof Sent', 'In Production', 'Quality Check', 'Ready', 'Picked Up'];
  return validStatuses.includes(status);
}

/**
 * Validate customer segment
 */
export function validateCustomerSegment(segment) {
  const validSegments = ['Walk-in', 'Team', 'Business', 'Graduation', 'Event'];
  return validSegments.includes(segment);
}

/**
 * Validate decoration technique
 */
export function validateTechnique(technique) {
  const validTechniques = ['DTF', 'DTG', 'Embroidery', 'Garment Wash'];
  return validTechniques.includes(technique);
}

/**
 * Validate quantity (must be positive integer)
 */
export function validateQuantity(quantity) {
  const num = parseInt(quantity, 10);
  return Number.isInteger(num) && num > 0;
}

/**
 * Validate price (must be positive number)
 */
export function validatePrice(price) {
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate date format (ISO 8601)
 */
export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
}

/**
 * Validate order creation input
 */
export function validateOrderInput(data) {
  const errors = [];

  if (!data.customer_id || !Number.isInteger(data.customer_id)) {
    errors.push('Invalid customer_id');
  }

  if (!data.order_number || typeof data.order_number !== 'string') {
    errors.push('Invalid order_number');
  }

  if (data.status && !validateOrderStatus(data.status)) {
    errors.push('Invalid status');
  }

  if (data.deadline && !validateDate(data.deadline)) {
    errors.push('Invalid deadline date');
  }

  if (data.total_price && !validatePrice(data.total_price)) {
    errors.push('Invalid total_price');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate customer creation input
 */
export function validateCustomerInput(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.segment && !validateCustomerSegment(data.segment)) {
    errors.push('Invalid customer segment');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate quote creation input
 */
export function validateQuoteInput(data) {
  const errors = [];

  if (!data.customer_id || !Number.isInteger(data.customer_id)) {
    errors.push('Invalid customer_id');
  }

  if (!data.technique || !validateTechnique(data.technique)) {
    errors.push('Invalid decoration technique');
  }

  if (!data.quantity || !validateQuantity(data.quantity)) {
    errors.push('Quantity must be a positive number');
  }

  if (data.estimated_price && !validatePrice(data.estimated_price)) {
    errors.push('Invalid estimated_price');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate inventory item input
 */
export function validateInventoryInput(data) {
  const errors = [];

  if (!data.sku || typeof data.sku !== 'string' || data.sku.length < 2) {
    errors.push('SKU must be at least 2 characters');
  }

  if (!data.item_name || typeof data.item_name !== 'string' || data.item_name.length < 2) {
    errors.push('Item name must be at least 2 characters');
  }

  if (!data.stock_level || !Number.isInteger(data.stock_level)) {
    errors.push('Stock level must be a positive integer');
  }

  if (data.reorder_threshold && !Number.isInteger(data.reorder_threshold)) {
    errors.push('Reorder threshold must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  validateEmail,
  validatePassword,
  validateOrderStatus,
  validateCustomerSegment,
  validateTechnique,
  validateQuantity,
  validatePrice,
  validateDate,
  sanitizeString,
  validateOrderInput,
  validateCustomerInput,
  validateQuoteInput,
  validateInventoryInput,
};
