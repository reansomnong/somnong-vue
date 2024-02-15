import { DataResponse } from './../models/Responses/DataResponse';
import { TokenDTO } from './../models/TokenDTO';
import { useAuthStore } from './../stores/auth/Auth';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}
const baseUrl = `${import.meta.env.VITE_API_URL}`;
const api = axios.create({ baseURL: baseUrl });

api.interceptors.request.use(async config => {
  if (config.url && config.url.charAt(0) === '/') {
    config.url = `${baseUrl}${config.url}`;
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const payload = {
        RefreshToken: refreshToken,
      };
      try {
        await axios
          .post<DataResponse<TokenDTO>>(`${baseUrl}auth/refreshtoken`, payload)
          .then(async (response) => {
            if (response.data.success) {
              localStorage.setItem(
                'accessToken',
                response.data.data.accessToken
              );
              localStorage.setItem(
                'refreshToken',
                response.data.data.refreshToken
              );
              const authStore = useAuthStore();
              await authStore.getAuthenticatedUser();
            }
          });
        return api.request(originalRequest);
      } catch (e) {
        throw new Error('Unauthtorized');
      }
    } else throw error;
  }
);

export { api };
