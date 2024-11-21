import { useState } from 'react';

export const useApiBase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      return await apiCall();
    } catch (err) {
      console.error(err);
      setError('An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleApiCall };
};
