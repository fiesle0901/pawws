import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Container } from '../../components/ui/Layout';
import type { CreateAnimalData } from '../../types';

export const AnimalOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAnimalData>({
    name: '',
    bio: '',
    journey_story: '',
  });

  const createAnimal = useMutation({
    mutationFn: async (data: CreateAnimalData) => {
      const response = await api.post('/animals/', data);
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/admin/animals/${data.id}/manage`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAnimal.mutate(formData);
  };

  return (
    <Container className="max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Start new Journey</h1>
        <p className="mt-2 text-gray-600">Share an animal's story to begin their recovery journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <Input
          label="Animal Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g. Max"
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="A brief introduction..."
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Journey Story</label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-48"
            value={formData.journey_story}
            onChange={(e) => setFormData({ ...formData, journey_story: e.target.value })}
            placeholder="Tell us their full story and what happened..."
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
           <Button type="submit" disabled={createAnimal.isPending}>
             {createAnimal.isPending ? 'Creating...' : 'Continue to Milestones'}
           </Button>
        </div>
      </form>
    </Container>
  );
};
