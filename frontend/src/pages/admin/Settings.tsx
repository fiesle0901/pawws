import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';

export const Settings: React.FC = () => {
    const queryClient = useQueryClient();
    const [qrFile, setQrFile] = useState<File | null>(null);

    const { data: qrImage, isLoading } = useQuery({
        queryKey: ['admin-qr'],
        queryFn: async () => {
             const res = await api.get('/donations/qr', { responseType: 'blob' });
             return URL.createObjectURL(res.data);
        },
        retry: false
    });

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!qrFile) return;
            const formData = new FormData();
            formData.append('image', qrFile);
            await api.post('/donations/admin/qr', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-qr'] });
            setQrFile(null);
            alert("QR Code updated!");
        }
    });

    return (
        <Container className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
            
            <div className="bg-white rounded-lg shadow p-6 max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Donation QR Code</h2>
                <p className="text-gray-600 mb-6 text-sm">Upload your GCash QR code here. This will be displayed to users when they want to donate.</p>
                
                <div className="space-y-4">
                    {isLoading ? (
                         <div className="h-64 w-64 bg-gray-100 flex items-center justify-center rounded">Loading...</div>
                    ) : qrImage ? (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current QR:</p>
                            <img src={qrImage} alt="Current QR" className="w-64 h-64 object-contain border border-gray-200 rounded" />
                        </div>
                    ) : (
                         <div className="h-64 w-64 bg-gray-50 flex items-center justify-center rounded border border-dashed border-gray-300 text-gray-400">
                             No QR Set
                         </div>
                    )}
                    
                    <div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => e.target.files && setQrFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                    </div>
                    
                    <Button 
                        onClick={() => uploadMutation.mutate()}
                        disabled={!qrFile || uploadMutation.isPending}
                    >
                        {uploadMutation.isPending ? 'Uploading...' : 'Update QR Code'}
                    </Button>
                </div>
            </div>
        </Container>
    );
};
