import { useEffect } from 'react';
import { DEFAULT_PET_IMAGE } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAnimals } from '../../hooks/useAnimals';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';

export const Donate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);
  
  const { data: animals, isLoading } = useAnimals();

  if (isLoading) return <Container className="py-8">Loading available animals...</Container>;

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {animals && animals.length > 0 ? (
          animals.map((animal) => (
            <div key={animal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-200 w-full object-cover relative overflow-hidden">
                 <img 
                   src={animal.image_url || DEFAULT_PET_IMAGE} 
                   alt={animal.name} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                 />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wide">
                   {animal.status}
                 </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{animal.bio}</p>
                <Link to={`/animals/${animal.id}`}>
                  <Button className="w-full" variant="secondary">Donate to {animal.name}</Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 max-w-[600px] mx-auto">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No animals currently in need</h3>
            <p className="text-gray-500">
              Great news! All our furry friends are currently taken care of. 
              Check back later or make a general donation to support our shelter.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};
