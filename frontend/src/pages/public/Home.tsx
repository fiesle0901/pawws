import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';
import type { Animal } from '../../types';

export const Home: React.FC = () => {
  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: async () => {
      const res = await api.get('/animals/');
      return res.data;
    }
  });

  if (isLoading) return <Container className="py-8">Loading journeys...</Container>;

  return (
    <Container className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Every Journey needs a Hero.</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Follow the recovery stories of animals in need and fund their milestones directly.
          See exactly where your donation goes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {animals?.map((animal) => (
          <div key={animal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 w-full object-cover relative">
               {animal.image_url ? (
                 <img src={animal.image_url} alt={animal.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
               )}
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wide">
                 {animal.status}
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{animal.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{animal.bio}</p>
              <Link to={`/animals/${animal.id}`}>
                <Button className="w-full" variant="secondary">View Journey</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
