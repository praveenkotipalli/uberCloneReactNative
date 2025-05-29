import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'http://192.168.0.192:8081';

export const fetchAPI = async (url, requestInit) => {
  try {
    const response = await fetch(url, requestInit);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const useFetch = (url, requestInit) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, requestInit);
      setData(result.data ?? result); // fallback if result.data is undefined
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, requestInit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
