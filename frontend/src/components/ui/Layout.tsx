import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow border-b border-gray-100">
      <Container>
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-primary">Pawws</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user?.role === 'admin' ? (
               <Link to="/admin" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
            ) : (
              <>
                <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Animals</Link>
                <Link to="/donate" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Donate</Link>
                {isAuthenticated && (
                   <Link to="/my-donations" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">My Donations</Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-gray-500 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 font-playfair"> 
    <Navbar />
    <main className="py-8">
      {children}
    </main>
  </div>
);
