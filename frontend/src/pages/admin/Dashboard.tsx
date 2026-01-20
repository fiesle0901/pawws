import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PET_IMAGE } from '../../constants';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';
import type { Animal } from '../../types';

export const Dashboard: React.FC = () => {
  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: async () => {
      const res = await api.get('/animals/');
      return res.data;
    }
  });

  if (isLoading) return <Container className="py-8">Loading dashboard...</Container>;

  return (
    <Container className="py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your rescued animals</p>
        </div>
        <Link to="/admin/animals/new">
          <Button>+ Add New Animal</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals?.map((animal) => (
          <div key={animal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-40 bg-gray-100 w-full relative">
                 <img src={animal.image_url || DEFAULT_PET_IMAGE} alt={animal.name} className="w-full h-full object-cover" />
               <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide border border-gray-100">
                 {animal.status}
               </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{animal.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{animal.bio}</p>
              <div className="flex space-x-2">
                <Link to={`/admin/animals/${animal.id}/manage`} className="flex-1">
                  <Button variant="secondary" className="w-full text-sm">Manage</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
