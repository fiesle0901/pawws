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

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow border-b border-gray-100">
      <Container>
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Paws-in-Progress</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Animals</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Shelters</a>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Login
            </button>
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
