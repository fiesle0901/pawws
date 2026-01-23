import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Container } from '../../components/ui/Layout';
import type { Milestone, CreateMilestoneData } from '../../types';
import { useAnimal, useAddMilestone, useUpdateAnimal } from '../../hooks/useAnimals';

export const AnimalManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState<CreateMilestoneData>({
    title: '',
    description: '',
    cost: 0,
  });

  const { data: animal, isLoading } = useAnimal(id);
  const updateAnimal = useUpdateAnimal(id);
  const createMilestone = useAddMilestone(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: '',
    journey_story: '',
    status: '',
    image: null as File | null
  });

  React.useEffect(() => {
    if (animal) {
      setEditFormData({
        name: animal.name,
        bio: animal.bio || '',
        journey_story: animal.journey_story || '',
        status: animal.status,
        image: null
      });
    }
  }, [animal]);

  if (isLoading) return <Container>Loading...</Container>;
  if (!animal) return <Container>Animal not found</Container>;

  const milestones: Milestone[] = animal.milestones || []; 

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editFormData.name);
    formData.append('bio', editFormData.bio);
    formData.append('journey_story', editFormData.journey_story);
    formData.append('status', editFormData.status);
    if (editFormData.image) {
      formData.append('image', editFormData.image);
    }
    
    updateAnimal.mutate(formData, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      }
    });
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage: {animal.name}</h1>
          <p className="mt-1 text-gray-500">{animal.status}</p>
        </div>
        <div className="space-x-4">
           <Button variant="outline" onClick={() => navigate(`/admin`)}>Back to Dashboard</Button>
           <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>Edit Details</Button>
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
              No milestones yet. Add the first step of recovery.
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
                    <div className="text-sm font-medium text-gray-900">PHP {milestone.current_amount} / PHP {milestone.cost}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'funded' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status}
                    </div>
                  </div>

                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Animal Details">
        <form onSubmit={handleUpdate} className="space-y-4">
           <Input 
             label="Name" 
             value={editFormData.name}
             onChange={e => setEditFormData({...editFormData, name: e.target.value})}
             required
           />
           <div className="space-y-1">
             <label className="block text-sm font-medium text-gray-700">Bio</label>
             <textarea
               className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24"
               value={editFormData.bio}
               onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
             />
           </div>
           <div className="space-y-1">
             <label className="block text-sm font-medium text-gray-700">Journey Story</label>
             <textarea
               className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32"
               value={editFormData.journey_story}
               onChange={(e) => setEditFormData({ ...editFormData, journey_story: e.target.value })}
             />
           </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              value={editFormData.status}
              onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
            >
              <option value="critical">Critical Care</option>
              <option value="recovering">Recovering</option>
              <option value="ready">Ready for Adoption</option>
              <option value="adopted">Adopted</option>
            </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Update Image</label>
             <input 
               type="file" 
               accept="image/*"
               onChange={(e) => {
                 if (e.target.files?.[0]) {
                   setEditFormData({...editFormData, image: e.target.files[0]});
                 }
               }}
               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
             />
           </div>
           <div className="flex justify-end pt-2">
             <Button type="submit" disabled={updateAnimal.isPending}>
               {updateAnimal.isPending ? 'Saving...' : 'Save Changes'}
             </Button>
           </div>
        </form>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Milestone">
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          createMilestone.mutate(newMilestone, {
            onSuccess: () => {
              setIsModalOpen(false);
              setNewMilestone({ title: '', description: '', cost: 0 });
            }
          }); 
        }} className="space-y-4">
          <Input 
            label="Title" 
            value={newMilestone.title}
            onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
            required
            placeholder="e.g. Initial Checkup"
          />
          <Input 
            label="Cost (PHP)" 
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
