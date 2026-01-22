import React, { useState } from 'react';
import { Container } from '../../components/ui/Layout';
import { useMyDonations, fetchProofBlob } from '../../hooks/useDonations';
import { Modal } from '../../components/ui/Modal';
import { Link } from 'react-router-dom';

export const UserDonations: React.FC = () => {
    const { data: donations, isLoading } = useMyDonations();
    const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

    const handleViewProof = async (proofUrl: string) => {
        try {
            const blob = await fetchProofBlob(proofUrl);
            const blobUrl = URL.createObjectURL(blob);
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

    if (isLoading) return <Container className="py-8">Loading your donations...</Container>;

    return (
        <Container className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
            <p className="text-gray-600 mb-8">Thank you for your generosity! Here is a history of your contributions.</p>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {donations && donations.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.map((donation) => (
                                <tr key={donation.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(donation.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {donation.animal_id ? (
                                            <Link to={`/animals/${donation.animal_id}`} className="text-primary hover:underline font-medium">
                                                {donation.animal_name}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        PHP {donation.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            donation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            donation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                         <button 
                                            onClick={() => donation.proof_url && handleViewProof(donation.proof_url)}
                                            className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        You haven't made any donations yet.
                        <div className="mt-4">
                            <Link to="/" className="text-primary hover:underline">Find an animal to help!</Link>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedProofUrl}
                onClose={closeProofModal}
                title="Your Receipt"
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
