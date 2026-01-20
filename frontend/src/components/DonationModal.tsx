import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestoneId: number;
    milestoneTitle: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, milestoneId, milestoneTitle }) => {
    const [amount, setAmount] = useState(100);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [step, setStep] = useState<1 | 2>(1); // 1: QR & Amount, 2: Upload Proof

    const { data: qrImage, isLoading: isQrLoading } = useQuery({
        queryKey: ['admin-qr'],
        queryFn: async () => {
            const res = await api.get('/donations/qr', { responseType: 'blob' });
            return URL.createObjectURL(res.data);
        },
        enabled: isOpen,
        retry: 1
    });

    const donationMutation = useMutation({
        mutationFn: async () => {
             const formData = new FormData();
             formData.append('milestone_id', milestoneId.toString());
             formData.append('amount', amount.toString());
             if (proofFile) {
                 formData.append('proof', proofFile);
             }
             
             await api.post('/donations/', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
             });
        },
        onSuccess: () => {
            onClose();
            alert("Donation submitted! Custom admins will review it.");
            setStep(1);
            setAmount(100);
            setProofFile(null);
        }
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Donate to: ${milestoneTitle}`}>
            {step === 1 ? (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">Scan the QR code below to pay via GCash.</p>
                        {isQrLoading ? (
                            <div className="h-48 w-48 bg-gray-100 animate-pulse mx-auto rounded-lg"/>
                        ) : qrImage ? (
                            <img src={qrImage} alt="GCash QR" className="w-48 h-48 mx-auto rounded-lg border border-gray-200" />
                        ) : (
                             <div className="text-red-500 text-sm">QR Code not set by admin.</div>
                        )}
                    </div>
                    
                    <Input 
                        label="Amount (PHP)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={1}
                        required
                    />

                    <Button className="w-full" onClick={() => setStep(2)}>
                        I have made the payment
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                     <div className="text-center">
                        <h4 className="font-medium text-gray-900">Upload Proof of Payment</h4>
                        <p className="text-sm text-gray-500 mt-1">Please upload the screenshot of your GCash receipt.</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => e.target.files && setProofFile(e.target.files[0])}
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                         <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                         <Button 
                            className="flex-1" 
                            disabled={!proofFile || donationMutation.isPending}
                            onClick={() => donationMutation.mutate()}
                         >
                            {donationMutation.isPending ? 'Submitting...' : 'Submit Proof'}
                         </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
