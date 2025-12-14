import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_CONFIG = {
  SERVER_BASE_URL: 'https://14.design.htmlacademy.pro/six-cities',
  TIMEOUT: 5000,
  TOKEN_KEY: 'six-cities-token',
  TOKEN_HEADER: 'X-Token'
} as const;

const getToken = (): string | null => {
  try {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

const removeToken = (): void => {
  localStorage.removeItem(API_CONFIG.TOKEN_KEY);
};

let apiInstance: AxiosInstance | null = null;

export const createAPI = (): AxiosInstance => {
  if (apiInstance) {
    return apiInstance;
  }

  const api = axios.create({
    baseURL: API_CONFIG.SERVER_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers[API_CONFIG.TOKEN_HEADER] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          removeToken();
        }
      }
      return Promise.reject(error);
    }
  );

  apiInstance = api;
  return api;
};
