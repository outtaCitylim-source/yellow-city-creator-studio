/**
 * API Client for Yellow City Creator Studio
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;

    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return Boolean(this.token);
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data?.data || data;
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  logout() {
    return this.post('/auth/logout', {});
  }

  getOrders(params = {}) {
    return this.get('/orders/list', params);
  }

  createOrder(orderData) {
    return this.post('/orders/create', orderData);
  }

  getCustomers(params = {}) {
    return this.get('/customers/list', params);
  }

  getInventory(params = {}) {
    return this.get('/inventory/list', params);
  }

  createQuote(quoteData) {
    return this.post('/quotes/create', quoteData);
  }
}

export const apiClient = new ApiClient();
