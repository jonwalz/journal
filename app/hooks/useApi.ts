import { useState } from 'react';
import { api } from '~/services/api';

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      return await api.get<T>(url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error };
}
