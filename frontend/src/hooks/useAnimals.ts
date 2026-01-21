import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Animal, CreateMilestoneData } from '../types';

export function useAnimals() {
  return useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data } = await api.get<Animal[]>('/animals/');
      return data;
    }
  });
}

export function useAnimal(id: string | undefined) {
  return useQuery<Animal>({
    queryKey: ['animal', id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const { data } = await api.get<Animal>(`/animals/${id}`);
      return data;
    },
    enabled: !!id
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const { data: res } = await api.post('/animals/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    }
  });
}

export function useAddMilestone(animalId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMilestoneData) => {
      if (!animalId) throw new Error("Animal ID is required");
      const { data: res } = await api.post(`/animals/${animalId}/milestones`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
    }
  });
}
