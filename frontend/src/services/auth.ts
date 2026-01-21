import { api } from '../lib/api';
import type { LoginCredentials, SignupCredentials, User, AuthResponse } from '../types';

export async function signup(info: SignupCredentials) {
  await api.post('/auth/signup', info);
  
  const credentials: LoginCredentials = {
    email: info.email,
    password: info.password
  };
  
  return await login(credentials);
}

export async function login(credentials: LoginCredentials) {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data.access_token;
}

export async function getAccount(token: string): Promise<User> {
  const { data } = await api.get<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
}
