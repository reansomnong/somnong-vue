import { ConfirmEmail } from './../../models/ConfirmEmail';
import { UserWithRoles } from './../../models/UserWithRoles';
import { DataResponse } from './../../models/Responses/DataResponse';
import { Register } from './../../models/Register';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from './../../models/Responses/ErrorResponse';
import { TokenDTO } from './../../models/TokenDTO';
import { Login } from './../../models/Login';
import { User } from '../../models/admin/User';
import { api } from './../../boot/axios';
import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { SuccessResponse } from './../../models/Responses/SuccessResponse';


interface AuthStore {
  user: User;
  roles: string[];
  loggedIn: boolean;
  data: string[]
}
const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthStore => ({
    user: {} as User,
    roles: [],
    loggedIn: false,
    data: [],
  }),
  getters: {
    getLoggedIn(): boolean {
      return this.loggedIn;
    },
    getUser(): User {
      return this.user;
    },
    getRoles(): string[] {
      return this.roles;
    },
  },
  actions: {
    async login(logincredentials: Login) {
      return await api
        .post<DataResponse<TokenDTO>>(baseUrl + 'v1/login', logincredentials)
        .then(async (response) => {
          if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            await this.getAuthenticatedUser();
            return response.data.success;
          }
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.user = {} as User;
      this.roles = [];
      this.loggedIn = false;
    },
    async register(registercredentials: Register) {
      await api
        .post<SuccessResponse>('auth/register', registercredentials)
        .then((response) => {
          if (response.data.success) {
            const alertStore = useAlertStore();
            alertStore.setMessage(response.data.message);
          }
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async write_data() {
      console.log(this.$state.user)
    },
    async getAuthenticatedUser() {
      await api.get<DataResponse<UserWithRoles>>('v1/admin/auth').then((response) => {
        this.loggedIn = true;
      });
    },
    async confirmEmail(confirmemaildata: ConfirmEmail) {
      await api
        .post<SuccessResponse>('auth/confirmemail', confirmemaildata)
        .then((response) => {
          const alertStore = useAlertStore();
          alertStore.setMessage(response.data.message);
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    updateUser(user: User) {
      this.user.userName = user.userName;
      this.user.email = user.email;
      this.user.fullName = user.fullName;
    }
  },
});
