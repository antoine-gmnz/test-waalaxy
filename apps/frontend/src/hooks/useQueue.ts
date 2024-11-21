import { API_ROUTES } from '../utils/routes';
import { useApiBase } from '../hooks/useApiBase';
import { apiRequest } from '../utils/axios';
import { Queue } from '@prisma/client';

export const useQueue = () => {
  const { loading, error, handleApiCall } = useApiBase();

  const fetchQueue = async (): Promise<Queue | null> => {
    return await handleApiCall(() => apiRequest('get', API_ROUTES.GET_QUEUE));
  };
  return { fetchQueue, loading, error };
};
