import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/api';

/**
 * Hook for fetching data from API
 */
export function useApi(endpoint, params = {}, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.get(endpoint, params);
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for posting data to API
 */
export function useApiMutation(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (body) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.post(endpoint, body);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { mutate, loading, error };
}

/**
 * Hook for orders
 */
export function useOrders(params = {}) {
  return useApi('/orders/list', params);
}

/**
 * Hook for creating orders
 */
export function useCreateOrder() {
  return useApiMutation('/orders/create');
}

/**
 * Hook for customers
 */
export function useCustomers(params = {}) {
  return useApi('/customers/list', params);
}

/**
 * Hook for inventory
 */
export function useInventory(params = {}) {
  return useApi('/inventory/list', params);
}

/**
 * Hook for creating quotes
 */
export function useCreateQuote() {
  return useApiMutation('/quotes/create');
}
