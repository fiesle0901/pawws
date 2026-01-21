import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login, signup, getAccount } from '../services/auth';
import type { LoginCredentials, SignupCredentials, User } from '../types';

interface AccessTokenPayload {
    sub: string;
    role?: string;
    exp: number;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const authQuery = useQuery<string | null>({
    queryKey: ['access_token'],
    queryFn: () => localStorage.getItem('token'),
    staleTime: Infinity, 
  });

  const loginMutation = useMutation<string, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (token) => {
      localStorage.setItem('token', token);
      queryClient.setQueryData(['access_token'], token);
      queryClient.invalidateQueries({ queryKey: ['access_token'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const signupMutation = useMutation<string, Error, SignupCredentials>({
    mutationFn: signup,
    onSuccess: (token) => {
      localStorage.setItem('token', token);
      queryClient.setQueryData(['access_token'], token);
      queryClient.invalidateQueries({ queryKey: ['access_token'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
    },
    onSettled: () => {
      localStorage.removeItem('token');
      queryClient.setQueryData(['access_token'], null);
      queryClient.setQueryData(['me', null], null);
      queryClient.invalidateQueries({ queryKey: ['access_token'] });
      queryClient.removeQueries({ queryKey: ['me'] });
    },
  });

  const accessToken = authQuery.data ?? null;
  const tokenPayload = useMemo(
    () =>
      accessToken ? jwtDecode<AccessTokenPayload>(accessToken) : null,
    [accessToken],
  );

  const accountQuery = useQuery<User, Error>({
    queryKey: ['me', accessToken],
    queryFn: () => getAccount(accessToken!),
    enabled: !!accessToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    accessToken,
    isAuthenticated: !!accessToken,
    isHydrating: authQuery.isLoading,
    tokenPayload,
    
    user: accountQuery.data ?? (tokenPayload && accessToken ? { role: tokenPayload.role } as User : null), 
    isLoading: authQuery.isLoading || accountQuery.isLoading,

    authQuery,

    logout: logoutMutation.mutate,
    logoutPending: logoutMutation.isPending,
    logoutMutation,

    login: async (creds: LoginCredentials) => {
        const token = await loginMutation.mutateAsync(creds);
        return await getAccount(token);
    },
    loginPending: loginMutation.isPending,
    loginMutation,

    signup: async (creds: SignupCredentials) => {
        await signupMutation.mutateAsync(creds);
    },
    signupPending: signupMutation.isPending,
    signupMutation,
    
    accountQuery,
    me: accountQuery.data ?? null,
  };
}
