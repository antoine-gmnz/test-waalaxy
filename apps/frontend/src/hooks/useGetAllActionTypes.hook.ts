import { useApiBase } from './useApiBase.hook';
import { apiRequest } from '../utils/axios';
import { API_ROUTES } from '../utils/routes';
import { ActionType } from '@prisma/client';

export const useFetchActionTypes = () => {
  const { loading, error, handleApiCall } = useApiBase();

  const fetchActionTypes = async (): Promise<ActionType[] | null> => {
    return await handleApiCall(() =>
      apiRequest('get', API_ROUTES.ACTION_TYPE_BASE_PATH)
    );
  };

  return { fetchActionTypes, loading, error };
};
