import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import type { Donation } from '../../types';

export const DonationReview: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

    const handleViewProof = async (proofUrl: string) => {
        try {
            const url = new URL(proofUrl);
            const res = await api.get(url.pathname + url.search, { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(res.data);
            setSelectedProofUrl(blobUrl);
        } catch (err) {
            console.error("Failed to load proof", err);
            alert("Failed to load proof image");
        }
    };

    const closeProofModal = () => {
        if (selectedProofUrl) {
            URL.revokeObjectURL(selectedProofUrl);
            setSelectedProofUrl(null);
        }
    };
    
    const { data: donations, isLoading } = useQuery<Donation[]>({
        queryKey: ['admin-donations'],
        queryFn: async () => {
            const res = await api.get('/donations/');
            return res.data;
        }
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: 'approved' | 'rejected' }) => {
            await api.put(`/donations/${id}/status`, { status });
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
        }
    });

    if (isLoading) return <Container className="py-8">Loading...</Container>;

    return (
        <Container className="py-8">
             <h1 className="text-3xl font-bold text-gray-900 mb-8">Donation Reviews</h1>
             
             <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {donations?.map((donation) => (
                            <tr key={donation.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{donation.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">PHP {donation.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        donation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        donation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {donation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(donation.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                                    <button 
                                        onClick={() => donation.proof_url && handleViewProof(donation.proof_url)}
                                        className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0"
                                    >
                                        View Proof
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {donation.status === 'pending' && (
                                        <>
                                            <Button 
                                                size="sm" 
                                                onClick={() => updateStatus.mutate({ id: donation.id, status: 'approved' })}
                                                disabled={updateStatus.isPending}
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => updateStatus.mutate({ id: donation.id, status: 'rejected' })}
                                                disabled={updateStatus.isPending}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             <Modal
                isOpen={!!selectedProofUrl}
                onClose={closeProofModal}
                title="Donation Proof"
             >
                {selectedProofUrl && (
                    <div className="flex justify-center">
                        <img 
                            src={selectedProofUrl} 
                            alt="Proof of payment" 
                            className="max-w-full max-h-[70vh] object-contain rounded"
                        />
                    </div>
                )}
             </Modal>
        </Container>
    );
};
