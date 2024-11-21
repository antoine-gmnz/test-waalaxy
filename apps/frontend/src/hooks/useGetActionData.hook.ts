import { useApiBase } from './useApiBase.hook';
import { apiRequest } from '../utils/axios';
import { API_ROUTES } from '../utils/routes';
import { Action } from '@prisma/client';

export const useGetActionData = () => {
  const { loading, error, handleApiCall } = useApiBase();

  const fetchActionData = async (actionId: string): Promise<Action | null> => {
    return await handleApiCall(() =>
      apiRequest('get', `${API_ROUTES.ACTION_BASE_PATH}${actionId}`)
    );
  };

  return { fetchActionData, loading, error };
};
