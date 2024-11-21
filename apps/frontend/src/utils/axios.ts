import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
});

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export const apiRequest = async <T>(
  method: RequestMethod,
  url: string,
  data?: unknown
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    // Add any custom error handling/logging if necessary
    console.error(
      `API Request failed for ${method.toUpperCase()} ${url}`,
      error
    );
    throw error; // Re-throw to be caught by the calling function
  }
};
