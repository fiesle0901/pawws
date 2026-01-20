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
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createAnimal = useMutation({
    mutationFn: async (data: CreateAnimalData & { image?: File | null }) => {
      const form = new FormData();
      form.append('name', data.name);
      form.append('bio', data.bio || '');
      form.append('journey_story', data.journey_story || '');
      form.append('status', 'recovering');
      if (imageFile) {
        form.append('image', imageFile);
      }

      const response = await api.post('/animals/', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/admin/animals/${data.id}/manage`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAnimal.mutate({ ...formData, image: imageFile });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p className="text-xs text-gray-400">If no image is uploaded, a default one will be used.</p>
        </div>

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
