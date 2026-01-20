import { useEffect } from 'react';
import { DEFAULT_PET_IMAGE } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Container } from '../../components/ui/Layout';
import { Button } from '../../components/ui/Button';
import type { Animal } from '../../types';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);
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
    

      <div className="relative rounded-2xl overflow-hidden  shadow-xl mb-16">
        <img 
          src="/src/assets/hero-strays.png" 
          alt="Happy rescued animals" 
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-12">
           <div className="text-center text-white max-w-3xl px-4">
             <h2 className="text-4xl md:text-5xl font-bold mb-4">Every Stray Given a Second Chance</h2>
             <p className="text-lg md:text-xl opacity-90">Join us in helping strays find their fur-ever homes.</p>
           </div>
        </div>
      </div>

    

      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Your Donation Helps</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your generous contributions directly support the medical care, rehabilitation, and daily needs of animals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">Medical Care</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Provides essential vaccinations, spay/neuter surgeries, and emergency treatments for injured strays.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">Safe Shelter</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Maintains clean facilities, warm bedding, and safe environments where animals can recover in peace.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">Nutritious Food</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Ensures every animal receives a high-quality diet tailored to their specific health and dietary needs.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" id="animals">Animals in need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 scroll-mt-24">
        {animals?.map((animal) => (
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">{animal.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{animal.bio}</p>
              <Link to={`/animals/${animal.id}`}>
                <Button className="w-full" variant="secondary">View Journey</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

        <div className="text-center bg-primary-50 rounded-2xl p-10 md:p-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to make a difference?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Every little bit counts towards saving a life.❤️
          </p>
          <Link 
            to="/donate" 
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Donate Now ❤️
          </Link>
        </div>
      </div>
    </Container>
  );
};
