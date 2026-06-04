/**
 * API Client for Yellow City Creator Studio
 * Handles all communication with backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data.data || data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PATCH request
   */
  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  logout() {
    this.setToken(null);
    return this.post('/auth/logout', {});
  }

  // Orders endpoints
  getOrders(params = {}) {
    return this.get('/orders/list', params);
  }

  createOrder(orderData) {
    return this.post('/orders/create', orderData);
  }

  // Customers endpoints
  getCustomers(params = {}) {
    return this.get('/customers/list', params);
  }

  // Inventory endpoints
  getInventory(params = {}) {
    return this.get('/inventory/list', params);
  }

  // Quotes endpoints
  createQuote(quoteData) {
    return this.post('/quotes/create', quoteData);
  }
}

export const apiClient = new ApiClient();
