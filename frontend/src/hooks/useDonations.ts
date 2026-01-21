import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Donation } from '../types';

export function useDonations() {
  return useQuery<Donation[]>({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data } = await api.get<Donation[]>('/donations/');
      return data;
    }
  });
}

export function useDonationQr() {
  return useQuery({
    queryKey: ['donation-qr'],
    queryFn: async () => {
      const { data } = await api.get('/donations/qr', { responseType: 'blob' });
      return URL.createObjectURL(data);
    },
    staleTime: 1000 * 60 * 5, 
  });
}

export const fetchProofBlob = async (proofUrl: string) => {
    const url = new URL(proofUrl);
    const { data } = await api.get(url.pathname + url.search, { responseType: 'blob' });
    return data;
};

export function useDonate() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const { data: res } = await api.post('/donations/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    }
  });
}

export function useUpdateDonationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: 'approved' | 'rejected' }) => {
      const { data } = await api.put(`/donations/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    }
  });
}

export function useUploadQr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const { data: res } = await api.post('/donations/admin/qr', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['donation-qr'] });
    }
  });
}
