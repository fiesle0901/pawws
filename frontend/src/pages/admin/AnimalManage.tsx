import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Container } from '../../components/ui/Layout';
import type { Animal, Milestone, CreateMilestoneData } from '../../types';

export const AnimalManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState<CreateMilestoneData>({
    title: '',
    description: '',
    cost: 0,
  });

  const { data: animal, isLoading } = useQuery<Animal>({
    queryKey: ['animal', id],
    queryFn: async () => {
       const res = await api.get(`/animals/${id}`);
       return res.data;
    }
  });


  
  const createMilestone = useMutation({
    mutationFn: async (data: CreateMilestoneData) => {
      const res = await api.post(`/animals/${id}/milestones`, data);
      return res.data;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      setNewMilestone({ title: '', description: '', cost: 0 });
      queryClient.invalidateQueries({ queryKey: ['animal', id] }); // If milestones are in animal
      // Or if I add a milestones query.
    }
  });

  if (isLoading) return <Container>Loading...</Container>;
  if (!animal) return <Container>Animal not found</Container>;

  const milestones: Milestone[] = (animal as any).milestones || []; 

  return (
    <Container className="py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage: {animal.name}</h1>
          <p className="mt-1 text-gray-500">{animal.status}</p>
        </div>
        <div className="space-x-4">
           <Button variant="outline" onClick={() => navigate(`/admin`)}>Back to Dashboard</Button>
           <Button onClick={() => setIsModalOpen(true)}>+ Add Milestone</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Recovery Journey Milestones</h3>
          <span className="text-sm text-gray-500">Total: {milestones.length}</span>
        </div>
        <ul className="divide-y divide-gray-100">
          {milestones.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              No milestones yet. Add the first step of recovery!
            </li>
          ) : (
            milestones.map((milestone) => (
              <li key={milestone.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                  <p className="text-sm text-gray-500">{milestone.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">${milestone.current_amount} / ${milestone.cost}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'funded' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status}
                    </div>
                  </div>
                  {/* Status toggles would go here */}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Milestone">
        <form onSubmit={(e) => { e.preventDefault(); createMilestone.mutate(newMilestone); }} className="space-y-4">
          <Input 
            label="Title" 
            value={newMilestone.title}
            onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
            required
            placeholder="e.g. Initial Checkup"
          />
          <Input 
            label="Cost ($)" 
            type="number"
            value={newMilestone.cost}
            onChange={e => setNewMilestone({...newMilestone, cost: parseInt(e.target.value)})}
            required
          />
           <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={createMilestone.isPending}>
              {createMilestone.isPending ? 'Adding...' : 'Add Milestone'}
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};
