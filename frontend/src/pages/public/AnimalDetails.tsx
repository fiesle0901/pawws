import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DonationModal } from '../../components/DonationModal';
import type { Animal, Milestone } from '../../types';
import { DEFAULT_PET_IMAGE } from '../../constants';

interface AnimalWithMilestones extends Animal {
  milestones: Milestone[];
}

export const AnimalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data: animal, isLoading } = useQuery<AnimalWithMilestones>({
    queryKey: ['animal', id],
    queryFn: async () => {
      const res = await api.get(`/animals/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <Container className="py-8">Loading journey...</Container>;
  if (!animal) return <Container className="py-8">Animal not found</Container>;

  if (isLoading) return <Container className="py-8">Loading journey...</Container>;
  if (!animal) return <Container className="py-8">Animal not found</Container>;
  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Story & Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="h-64 md:h-96 bg-gray-200 rounded-xl overflow-hidden relative">
               <img src={animal.image_url || DEFAULT_PET_IMAGE} alt={animal.name} className="w-full h-full object-cover" />
           </div>
           
           <div>
             <h1 className="text-4xl font-bold text-gray-900 mb-2">{animal.name}'s Journey</h1>
             <p className="text-xl text-primary font-medium mb-6">Status: {animal.status}</p>
             <div className="prose max-w-none text-gray-600 whitespace-pre-line">
               {animal.journey_story}
             </div>
           </div>
        </div>

        {/* Right Column: Timeline & Funding */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Recovery Timeline</h3>
            
            <div className="flow-root">
               {/* Custom Timeline rendering for this page to inject buttons */}
               <ul className="-mb-8">
                {animal.milestones?.map((milestone, idx) => (
                  <li key={milestone.id}>
                    <div className="relative pb-12">
                      {idx !== animal.milestones.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            milestone.status === 'completed' ? 'bg-green-500' : 
                            milestone.status === 'funded' ? 'bg-blue-500' : 'bg-gray-100'
                          }`}>
                            {milestone.status === 'completed' ? '✓' : 
                             milestone.status === 'funded' ? '₱' : '•'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <div className="flex justify-between mb-1">
                             <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                             <span className="text-xs font-semibold text-gray-500 uppercase">{milestone.status}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{milestone.description}</p>
                          
                          <div className="mt-2">
                             <div className="flex justify-between text-xs mb-1">
                               <span>PHP {milestone.current_amount} raised</span>
                               <span className="text-gray-400">Goal: PHP {milestone.cost}</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, (milestone.current_amount / milestone.cost) * 100)}%` }}></div>
                             </div>
                             
                             {milestone.status === 'pending' && (
                               <Button 
                                 size="sm" 
                                 variant="primary" 
                                 className="w-full"
                                 onClick={() => setSelectedMilestone(milestone)}
                               >
                                 Donate to this step
                               </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {selectedMilestone && (
        <DonationModal
          isOpen={!!selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          milestoneId={selectedMilestone.id}
          milestoneTitle={selectedMilestone.title}
        />
      )}

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Thank You!"
      >
        <div className="text-center py-4">
           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
           </div>
           <h3 className="text-lg leading-6 font-medium text-gray-900">Donation Successful</h3>
           <p className="mt-2 text-sm text-gray-500">
             You've helped {animal.name} get closer to full recovery!
           </p>
           <div className="mt-6">
             <Button onClick={() => setIsSuccessModalOpen(false)} className="w-full">
               Continue Journey
             </Button>
           </div>
        </div>
      </Modal>
    </Container>
  );
};
