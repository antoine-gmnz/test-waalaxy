import { useApiBase } from './useApiBase';
import { apiRequest } from '../utils/axios';
import { API_ROUTES } from '../utils/routes';

type CreateActionParams = {
  name: string;
  actionTypeId: string;
};

export const useCreateAction = () => {
  const { loading, error, handleApiCall } = useApiBase();

  const createAction = async (params: CreateActionParams) => {
    await handleApiCall(() =>
      apiRequest('post', API_ROUTES.ACTION_BASE_PATH, params)
    );
  };

  return { createAction, loading, error };
};
